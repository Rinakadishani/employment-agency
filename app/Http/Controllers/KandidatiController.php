<?php

namespace App\Http\Controllers;

use App\Models\Kandidati;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KandidatiController extends Controller
{
    public function index(Request $request)
    {
        $kandidatet = Kandidati::with('user')
            ->when($request->search ?? null, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('emri', 'like', "%$search%")
                      ->orWhere('mbiemri', 'like', "%$search%")
                      ->orWhere('profesioni', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%");
                });
            })
            ->when($request->profesioni ?? null, fn($q, $v) =>
                $q->where('profesioni', 'like', "%$v%")
            )
            ->latest()
            ->paginate(10);

        return response()->json($kandidatet);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emri'          => 'required|string|max:255',
            'mbiemri'       => 'required|string|max:255',
            'email'         => 'required|email|unique:kandidatet,email',
            'telefoni'      => 'nullable|string',
            'data_lindjes'  => 'nullable|date',
            'adresa'        => 'nullable|string',
            'profesioni'    => 'nullable|string',
            'pervoja_vite'  => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kandidati = Kandidati::create([
            ...$request->only([
                'emri', 'mbiemri', 'email', 'telefoni',
                'data_lindjes', 'adresa', 'profesioni', 'pervoja_vite'
            ]),
            'user_id' => auth('api')->id(),
        ]);

        return response()->json([
            'message'   => 'Candidate created successfully',
            'kandidati' => $kandidati
        ], 201);
    }

    public function show(Kandidati $kandidati)
    {
        return response()->json([
            'kandidati' => $kandidati->load(['user', 'aftesite', 'cvt', 'aplikimet.vendiPunes'])
        ]);
    }

    public function update(Request $request, Kandidati $kandidati)
    {
        if ($kandidati->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'emri'         => 'sometimes|string|max:255',
            'mbiemri'      => 'sometimes|string|max:255',
            'telefoni'     => 'nullable|string',
            'data_lindjes' => 'nullable|date',
            'adresa'       => 'nullable|string',
            'profesioni'   => 'nullable|string',
            'pervoja_vite' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kandidati->update($request->only([
            'emri', 'mbiemri', 'telefoni',
            'data_lindjes', 'adresa', 'profesioni', 'pervoja_vite'
        ]));

        return response()->json([
            'message'   => 'Candidate updated successfully',
            'kandidati' => $kandidati
        ]);
    }

    public function destroy(Kandidati $kandidati)
    {
        if ($kandidati->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $kandidati->delete();

        return response()->json(['message' => 'Candidate deleted successfully']);
    }

    public function myProfile()
    {
        $kandidati = Kandidati::with(['aftesite', 'cvt', 'aplikimet.vendiPunes'])
            ->where('user_id', auth('api')->id())
            ->first();

        if (!$kandidati) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json(['kandidati' => $kandidati]);
    }
}