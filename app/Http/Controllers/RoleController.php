<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emertimi'        => 'required|string|unique:roles',
            'pershkrimi'      => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = Role::create([
            'emertimi'        => $request->emertimi,
            'normalized_name' => strtoupper($request->emertimi),
            'pershkrimi'      => $request->pershkrimi,
        ]);

        return response()->json([
            'message' => 'Role created successfully',
            'role'    => $role
        ], 201);
    }

    public function update(Request $request, Role $role)
    {
        $role->update($request->only(['emertimi', 'pershkrimi']));

        return response()->json([
            'message' => 'Role updated successfully',
            'role'    => $role
        ]);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }
}