<?php

namespace App\Http\Controllers;

use App\Models\Fatura;
use App\Models\Kompania;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FaturaController extends Controller
{
    public function index(Request $request)
    {
        $faturat = Fatura::with('kompania')
            ->when($request->statusi ?? null, fn($q, $v) =>
                $q->where('statusi', $v)
            )
            ->when($request->kompani_id ?? null, fn($q, $v) =>
                $q->where('kompani_id', $v)
            )
            ->latest()
            ->paginate(10);

        return response()->json($faturat);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kompani_id'   => 'required|exists:kompanitë,kompani_id',
            'shuma'        => 'required|numeric|min:0',
            'pershkrimi'   => 'nullable|string',
            'data_pageses' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $fatura = Fatura::create($request->only([
            'kompani_id', 'shuma', 'pershkrimi', 'data_pageses'
        ]));

        return response()->json([
            'message' => 'Invoice created successfully',
            'fatura'  => $fatura->load('kompania')
        ], 201);
    }

    public function show(Fatura $fatura)
    {
        return response()->json([
            'fatura' => $fatura->load('kompania')
        ]);
    }

    public function update(Request $request, Fatura $fatura)
    {
        $fatura->update($request->only([
            'shuma', 'pershkrimi', 'data_pageses', 'statusi'
        ]));

        return response()->json([
            'message' => 'Invoice updated successfully',
            'fatura'  => $fatura
        ]);
    }

    public function destroy(Fatura $fatura)
    {
        $fatura->delete();
        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}