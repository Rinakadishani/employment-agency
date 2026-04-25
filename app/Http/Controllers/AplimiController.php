<?php

namespace App\Http\Controllers;

use App\Models\Aplikimi;
use App\Models\Kandidati;
use App\Models\VendiPunes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AplimiController extends Controller
{
    public function index(Request $request)
    {
        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();

        if (!$kandidati) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $aplikimet = Aplikimi::with(['vendiPunes.kompania'])
            ->where('kandidat_id', $kandidati->kandidat_id)
            ->latest()
            ->paginate(10);

        return response()->json($aplikimet);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vend_id'          => 'required|exists:vendet_punes,vend_id',
            'letra_motivimit'  => 'nullable|string',
            'shenimet'         => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();

        if (!$kandidati) {
            return response()->json(['message' => 'You must have a candidate profile first'], 403);
        }

        // Check duplicate
        $existing = Aplikimi::where('kandidat_id', $kandidati->kandidat_id)
            ->where('vend_id', $request->vend_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied for this position'], 422);
        }

        $aplikimi = Aplikimi::create([
            'kandidat_id'     => $kandidati->kandidat_id,
            'vend_id'         => $request->vend_id,
            'letra_motivimit' => $request->letra_motivimit,
            'shenimet'        => $request->shenimet,
            'statusi'         => 'pending',
        ]);

        return response()->json([
            'message'  => 'Application submitted successfully',
            'aplikimi' => $aplikimi->load('vendiPunes.kompania')
        ], 201);
    }

    public function show(Aplikimi $aplikimi)
    {
        return response()->json([
            'aplikimi' => $aplikimi->load(['vendiPunes.kompania', 'kandidati', 'intervistat', 'oferta'])
        ]);
    }

    public function update(Request $request, Aplikimi $aplikimi)
    {
        // Only admin/manager can update status
        $aplikimi->update($request->only(['statusi', 'shenimet']));

        return response()->json([
            'message'  => 'Application updated successfully',
            'aplikimi' => $aplikimi
        ]);
    }

    public function destroy(Aplikimi $aplikimi)
    {
        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();

        if (!$kandidati || $aplikimi->kandidat_id !== $kandidati->kandidat_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $aplikimi->delete();

        return response()->json(['message' => 'Application withdrawn successfully']);
    }

    public function allApplications(Request $request)
    {
        // Admin/Manager only
        $aplikimet = Aplikimi::with(['vendiPunes.kompania', 'kandidati'])
            ->when($request->statusi ?? null, fn($q, $v) => $q->where('statusi', $v))
            ->latest()
            ->paginate(15);

        return response()->json($aplikimet);
    }
}