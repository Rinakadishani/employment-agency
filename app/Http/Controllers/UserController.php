<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles')
            ->when($request->search ?? null, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('emri', 'like', "%$search%")
                      ->orWhere('mbiemri', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%");
                });
            })
            ->latest()
            ->paginate(15);

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emri'        => 'required|string|max:255',
            'mbiemri'     => 'required|string|max:255',
            'email'       => 'required|email|unique:users',
            'password'    => 'required|string|min:8',
            'phone_number'=> 'nullable|string',
            'role_id'     => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'emri'         => $request->emri,
            'mbiemri'      => $request->mbiemri,
            'email'        => $request->email,
            'password'     => bcrypt($request->password),
            'phone_number' => $request->phone_number,
            'statusi'      => true,
        ]);

        $user->roles()->attach($request->role_id);

        return response()->json([
            'message' => 'User created successfully',
            'user'    => $user->load('roles')
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json([
            'user' => $user->load('roles')
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'emri'        => 'sometimes|string|max:255',
            'mbiemri'     => 'sometimes|string|max:255',
            'phone_number'=> 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['emri', 'mbiemri', 'phone_number']));

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user->load('roles')
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth('api')->id()) {
            return response()->json(['message' => 'Cannot delete your own account'], 422);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function toggleStatus(User $user)
    {
        $user->update(['statusi' => !$user->statusi]);
        return response()->json([
            'message' => 'User status updated',
            'user'    => $user
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->roles()->syncWithoutDetaching([$request->role_id]);

        return response()->json([
            'message' => 'Role assigned successfully',
            'user'    => $user->load('roles')
        ]);
    }

    public function removeRole(Request $request, User $user)
    {
        $user->roles()->detach($request->role_id);

        return response()->json([
            'message' => 'Role removed successfully',
            'user'    => $user->load('roles')
        ]);
    }
}