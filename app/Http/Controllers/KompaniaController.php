<?php

namespace App\Http\Controllers;

use App\Models\Kompania;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KompaniaController extends Controller
{
    public function index(Request $request)
    {
        $kompanitë = Kompania::with('user')
            ->when($request->search ?? null, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('emri_kompanise', 'like', "%$search%")
                      ->orWhere('sektori', 'like', "%$search%")
                      ->orWhere('lokacioni', 'like', "%$search%");
                });
            })
            ->when($request->sektori ?? null, fn($q, $v) =>
                $q->where('sektori', $v)
            )
            ->latest()
            ->paginate(10);

        return response()->json($kompanitë);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emri_kompanise'    => 'required|string|max:255',
            'sektori'           => 'nullable|string',
            'adresa'            => 'nullable|string',
            'personi_kontaktit' => 'nullable|string',
            'email'             => 'nullable|email',
            'telefoni'          => 'nullable|string',
            'faqja_web'         => 'nullable|url',
            'numri_punonjesve'  => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existing = Kompania::where('user_id', auth('api')->id())->first();
        if ($existing) {
            return response()->json(['message' => 'You already have a company profile'], 422);
        }

        $kompania = Kompania::create([
            ...$request->only([
                'emri_kompanise', 'sektori', 'adresa',
                'personi_kontaktit', 'email', 'telefoni',
                'faqja_web', 'numri_punonjesve'
            ]),
            'user_id' => auth('api')->id(),
        ]);

        return response()->json([
            'message'  => 'Company created successfully',
            'kompania' => $kompania
        ], 201);
    }

    public function show(Kompania $kompania)
    {
        return response()->json([
            'kompania' => $kompania->load(['user', 'vendetPunes'])
        ]);
    }

    public function update(Request $request, Kompania $kompania)
    {
        if ($kompania->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $kompania->update($request->only([
            'emri_kompanise', 'sektori', 'adresa',
            'personi_kontaktit', 'email', 'telefoni',
            'faqja_web', 'numri_punonjesve'
        ]));

        return response()->json([
            'message'  => 'Company updated successfully',
            'kompania' => $kompania
        ]);
    }

    public function destroy(Kompania $kompania)
    {
        if ($kompania->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $kompania->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }

    public function myCompany()
    {
        $kompania = Kompania::with(['vendetPunes'])
            ->where('user_id', auth('api')->id())
            ->first();

        if (!$kompania) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json(['kompania' => $kompania]);
    }
}