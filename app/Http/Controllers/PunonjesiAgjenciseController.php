<?php

namespace App\Http\Controllers;

use App\Models\PunonjesiAgjencise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PunonjesiAgjenciseController extends Controller
{
    public function index(Request $request)
    {
        $punonjesit = PunonjesiAgjencise::with('user')
            ->when($request->search ?? null, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('emri', 'like', "%$search%")
                      ->orWhere('mbiemri', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%")
                      ->orWhere('roli', 'like', "%$search%");
                });
            })
            ->when(isset($request->aktiv), fn($q) =>
                $q->where('aktiv', $request->aktiv)
            )
            ->latest()
            ->paginate(10);

        return response()->json($punonjesit);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'  => 'required|exists:users,id',
            'emri'     => 'required|string|max:255',
            'mbiemri'  => 'required|string|max:255',
            'email'    => 'required|email|unique:punonjesit_agjencise,email',
            'telefoni' => 'nullable|string',
            'roli'     => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $punonjesi = PunonjesiAgjencise::create($request->only([
            'user_id', 'emri', 'mbiemri', 'email', 'telefoni', 'roli'
        ]));

        return response()->json([
            'message'   => 'Staff member created successfully',
            'punonjesi' => $punonjesi
        ], 201);
    }

    public function show(PunonjesiAgjencise $punonjesiAgjencise)
    {
        return response()->json([
            'punonjesi' => $punonjesiAgjencise->load('user')
        ]);
    }

    public function update(Request $request, PunonjesiAgjencise $punonjesiAgjencise)
    {
        $punonjesiAgjencise->update($request->only([
            'emri', 'mbiemri', 'email', 'telefoni', 'roli', 'aktiv'
        ]));

        return response()->json([
            'message'   => 'Staff member updated successfully',
            'punonjesi' => $punonjesiAgjencise
        ]);
    }

    public function destroy(PunonjesiAgjencise $punonjesiAgjencise)
    {
        $punonjesiAgjencise->delete();
        return response()->json(['message' => 'Staff member deleted successfully']);
    }

    public function toggleActive(PunonjesiAgjencise $punonjesiAgjencise)
    {
        $punonjesiAgjencise->update(['aktiv' => !$punonjesiAgjencise->aktiv]);
        return response()->json([
            'message'   => 'Status updated successfully',
            'punonjesi' => $punonjesiAgjencise
        ]);
    }
}