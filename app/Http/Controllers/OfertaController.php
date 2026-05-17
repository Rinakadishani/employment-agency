<?php

namespace App\Http\Controllers;

use App\Models\Oferta;
use App\Models\Aplikimi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OfertaController extends Controller
{
    public function index()
    {
        $ofertat = Oferta::with(['aplikimi.kandidati', 'aplikimi.vendiPunes'])
            ->latest()
            ->paginate(10);

        return response()->json($ofertat);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'aplikim_id'      => 'required|exists:aplikimet,aplikim_id',
            'paga_ofruar'     => 'required|integer|min:0',
            'kushtet'         => 'nullable|string',
            'data_pergjigjes' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if offer already exists
        $existing = Oferta::where('aplikim_id', $request->aplikim_id)->first();
        if ($existing) {
            return response()->json(['message' => 'An offer already exists for this application'], 422);
        }

        $oferta = Oferta::create($request->only([
            'aplikim_id', 'paga_ofruar', 'kushtet', 'data_pergjigjes'
        ]));

        // Update application status
        Aplikimi::find($request->aplikim_id)->update(['statusi' => 'pranuar']);

        return response()->json([
            'message' => 'Offer sent successfully',
            'oferta'  => $oferta->load('aplikimi.kandidati')
        ], 201);
    }

    public function show(Oferta $oferta)
    {
        return response()->json([
            'oferta' => $oferta->load(['aplikimi.kandidati', 'aplikimi.vendiPunes'])
        ]);
    }

    public function update(Request $request, Oferta $oferta)
    {
        $oferta->update($request->only(['statusi', 'paga_ofruar', 'kushtet', 'data_pergjigjes']));

        return response()->json([
            'message' => 'Offer updated successfully',
            'oferta'  => $oferta
        ]);
    }

    public function destroy(Oferta $oferta)
    {
        $oferta->delete();
        return response()->json(['message' => 'Offer deleted successfully']);
    }
}