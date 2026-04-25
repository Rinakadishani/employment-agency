<?php

namespace App\Http\Controllers;

use App\Models\Intervista;
use App\Models\Aplikimi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IntervistController extends Controller
{
    public function index()
    {
        $intervistat = Intervista::with(['aplikimi.kandidati', 'aplikimi.vendiPunes'])
            ->latest()
            ->paginate(10);

        return response()->json($intervistat);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'aplikim_id'       => 'required|exists:aplikimet,aplikim_id',
            'data_intervistes' => 'required|date|after:today',
            'ora'              => 'required',
            'lokacioni'        => 'nullable|string',
            'intervistues_emri'=> 'nullable|string',
            'shenimet'         => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $intervista = Intervista::create($request->only([
            'aplikim_id', 'data_intervistes', 'ora',
            'lokacioni', 'intervistues_emri', 'shenimet'
        ]));

        // Update application status
        Aplikimi::find($request->aplikim_id)->update(['statusi' => 'intervistuar']);

        return response()->json([
            'message'    => 'Interview scheduled successfully',
            'intervista' => $intervista->load('aplikimi.kandidati')
        ], 201);
    }

    public function show(Intervista $intervista)
    {
        return response()->json([
            'intervista' => $intervista->load(['aplikimi.kandidati', 'aplikimi.vendiPunes'])
        ]);
    }

    public function update(Request $request, Intervista $intervista)
    {
        $intervista->update($request->only([
            'data_intervistes', 'ora', 'lokacioni',
            'intervistues_emri', 'rezultati', 'shenimet'
        ]));

        return response()->json([
            'message'    => 'Interview updated successfully',
            'intervista' => $intervista
        ]);
    }

    public function destroy(Intervista $intervista)
    {
        $intervista->delete();
        return response()->json(['message' => 'Interview deleted successfully']);
    }
}