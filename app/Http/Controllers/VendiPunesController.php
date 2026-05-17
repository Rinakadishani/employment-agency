<?php

namespace App\Http\Controllers;

use App\Models\VendiPunes;
use App\Models\Kompania;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class VendiPunesController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'lloji_kontrates', 'lokacioni', 'paga_min', 'paga_max', 'statusi']);

        $vendet = VendiPunes::with('kompania')
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('titulli', 'like', "%$search%")
                      ->orWhere('pershkrimi', 'like', "%$search%")
                      ->orWhereHas('kompania', fn($q) =>
                          $q->where('emri_kompanise', 'like', "%$search%")
                      );
                });
            })
            ->when($filters['lloji_kontrates'] ?? null, fn($q, $v) =>
                $q->where('lloji_kontrates', $v)
            )
            ->when($filters['lokacioni'] ?? null, fn($q, $v) =>
                $q->where('lokacioni', 'like', "%$v%")
            )
            ->when($filters['paga_min'] ?? null, fn($q, $v) =>
                $q->where('paga_min', '>=', $v)
            )
            ->when($filters['paga_max'] ?? null, fn($q, $v) =>
                $q->where('paga_max', '<=', $v)
            )
            ->when($filters['statusi'] ?? null, fn($q, $v) =>
                $q->where('statusi', $v)
            )
            ->where('statusi', 'aktiv')
            ->latest()
            ->paginate(10);

        return response()->json($vendet);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulli'         => 'required|string|max:255',
            'pershkrimi'      => 'required|string',
            'kerkesat'        => 'nullable|string',
            'lloji_kontrates' => 'required|in:full-time,part-time,remote,internship',
            'paga_min'        => 'required|integer|min:0',
            'paga_max'        => 'required|integer|gte:paga_min',
            'lokacioni'       => 'required|string',
            'afati'           => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kompania = Kompania::where('user_id', auth('api')->id())->first();

        if (!$kompania) {
            return response()->json(['message' => 'You must have a company profile first'], 403);
        }

        $vendi = VendiPunes::create([
            ...$request->only([
                'titulli', 'pershkrimi', 'kerkesat',
                'lloji_kontrates', 'paga_min', 'paga_max',
                'lokacioni', 'afati'
            ]),
            'kompani_id' => $kompania->kompani_id,
            'statusi'    => 'aktiv',
        ]);

        return response()->json([
            'message' => 'Job position created successfully',
            'vendi'   => $vendi->load('kompania')
        ], 201);
    }

    public function show(VendiPunes $vendiPunes)
    {
        return response()->json([
            'vendi' => $vendiPunes->load(['kompania', 'aplikimet'])
        ]);
    }

    public function update(Request $request, VendiPunes $vendiPunes)
    {
        $kompania = Kompania::where('user_id', auth('api')->id())->first();

        if (!$kompania || $vendiPunes->kompani_id !== $kompania->kompani_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titulli'         => 'sometimes|string|max:255',
            'pershkrimi'      => 'sometimes|string',
            'kerkesat'        => 'nullable|string',
            'lloji_kontrates' => 'sometimes|in:full-time,part-time,remote,internship',
            'paga_min'        => 'sometimes|integer|min:0',
            'paga_max'        => 'sometimes|integer|gte:paga_min',
            'lokacioni'       => 'sometimes|string',
            'afati'           => 'sometimes|date',
            'statusi'         => 'sometimes|in:aktiv,mbyllur,draft',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $vendiPunes->update($request->only([
            'titulli', 'pershkrimi', 'kerkesat',
            'lloji_kontrates', 'paga_min', 'paga_max',
            'lokacioni', 'afati', 'statusi'
        ]));

        return response()->json([
            'message' => 'Job position updated successfully',
            'vendi'   => $vendiPunes->load('kompania')
        ]);
    }

    public function destroy(VendiPunes $vendiPunes)
    {
        $kompania = Kompania::where('user_id', auth('api')->id())->first();

        if (!$kompania || $vendiPunes->kompani_id !== $kompania->kompani_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vendiPunes->delete();

        return response()->json(['message' => 'Job position deleted successfully']);
    }
}