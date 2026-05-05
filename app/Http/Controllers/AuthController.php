<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\RefreshToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emri'          => 'required|string|max:255',
            'mbiemri'       => 'required|string|max:255',
            'email'         => 'required|email|unique:users',
            'password'      => 'required|string|min:8|confirmed',
            'phone_number'  => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'emri'         => $request->emri,
            'mbiemri'      => $request->mbiemri,
            'email'        => $request->email,
            'password'     => bcrypt($request->password),
            'phone_number' => $request->phone_number,
            'statusi'      => true,
        ]);

        $userRole = Role::where('normalized_name', 'USER')->first();
        if ($userRole) {
            $user->roles()->attach($userRole->id);
        }

        $accessToken  = auth('api')->login($user);
        $refreshToken = $this->createRefreshToken($user);

        return response()->json([
            'message'      => 'User registered successfully',
            'user'         => $user->load('roles'),
            'access_token' => $accessToken,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
        ], 201)->withCookie(
            cookie('refresh_token', $refreshToken, 60 * 24 * 7, '/', null, false, true, false, 'strict')
        );
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        if (!$token = auth('api')->attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth('api')->user();

        if (!$user->statusi) {
            auth('api')->logout();
            return response()->json(['message' => 'Your account has been deactivated'], 403);
        }

        // Revoke all previous refresh tokens for this user
        RefreshToken::where('user_id', $user->id)
            ->where('revoked', false)
            ->update(['revoked' => true]);

        $refreshToken = $this->createRefreshToken($user);

        return response()->json([
            'message'      => 'Login successful',
            'user'         => $user->load('roles'),
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
        ])->withCookie(
            cookie('refresh_token', $refreshToken, 60 * 24 * 7, '/', null, false, true, false, 'strict')
        );
    }

    public function logout(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if ($refreshToken) {
            RefreshToken::where('token', $refreshToken)
                ->update(['revoked' => true]);
        }

        // Revoke ALL refresh tokens for this user
        $user = auth('api')->user();
        if ($user) {
            RefreshToken::where('user_id', $user->id)
                ->update(['revoked' => true]);
        }

        auth('api')->logout();

        return response()->json([
            'message' => 'Successfully logged out'
        ])->withCookie(cookie()->forget('refresh_token'));
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token not found'], 401);
        }

        $tokenRecord = RefreshToken::where('token', $refreshToken)
            ->where('revoked', false)
            ->where('expires', '>', now())
            ->first();

        if (!$tokenRecord) {
            return response()->json(['message' => 'Invalid or expired refresh token'], 401);
        }

        // Revoke old refresh token (rotation)
        $tokenRecord->update(['revoked' => true]);

        $user = User::find($tokenRecord->user_id);

        if (!$user || !$user->statusi) {
            return response()->json(['message' => 'User not found or inactive'], 401);
        }

        $newAccessToken  = auth('api')->login($user);
        $newRefreshToken = $this->createRefreshToken($user);

        return response()->json([
            'message'      => 'Token refreshed successfully',
            'user'         => $user->load('roles'),
            'access_token' => $newAccessToken,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
        ])->withCookie(
            cookie('refresh_token', $newRefreshToken, 60 * 24 * 7, '/', null, false, true, false, 'strict')
        );
    }

    public function me()
    {
        return response()->json([
            'user' => auth('api')->user()->load('roles')
        ]);
    }

    public function revokeAllTokens()
    {
        $user = auth('api')->user();

        RefreshToken::where('user_id', $user->id)
            ->update(['revoked' => true]);

        auth('api')->logout();

        return response()->json([
            'message' => 'All sessions revoked successfully'
        ])->withCookie(cookie()->forget('refresh_token'));
    }

    protected function createRefreshToken(User $user): string
    {
        // Clean up expired tokens for this user
        RefreshToken::where('user_id', $user->id)
            ->where('expires', '<', now())
            ->delete();

        $token = Str::random(64);

        RefreshToken::create([
            'user_id' => $user->id,
            'token'   => $token,
            'expires' => now()->addDays(7),
            'revoked' => false,
        ]);

        return $token;
    }
}