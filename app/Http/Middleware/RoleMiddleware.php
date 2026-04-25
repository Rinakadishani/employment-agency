<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (!auth('api')->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth('api')->user();

        $userRoles = $user->roles->pluck('normalized_name')->toArray();

        foreach ($roles as $role) {
            if (in_array(strtoupper($role), $userRoles)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Unauthorized — insufficient role'], 403);
    }
}
