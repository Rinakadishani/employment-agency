<?php

namespace App\Http\Controllers;

use App\Models\Aftesia;
use App\Models\Kandidati;
use App\Models\KandidatAftesia;
use Illuminate\Http\Request;

class AftesiaController extends Controller
{
    public function index()
    {
        return response()->json(['aftesite' => Aftesia::all()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'emri_aftesise' => 'required|string|unique:aftesite',
            'kategoria'     => 'nullable|string',
        ]);

        $aftesia = Aftesia::create($request->only(['emri_aftesise', 'kategoria']));

        return response()->json([
            'message' => 'Skill created successfully',
            'aftesia' => $aftesia
        ], 201);
    }

    public function update(Request $request, Aftesia $aftesia)
    {
        $aftesia->update($request->only(['emri_aftesise', 'kategoria']));
        return response()->json(['message' => 'Skill updated', 'aftesia' => $aftesia]);
    }

    public function destroy(Aftesia $aftesia)
    {
        $aftesia->delete();
        return response()->json(['message' => 'Skill deleted']);
    }

    public function assignToKandidat(Request $request)
    {
        $request->validate([
            'aftesi_id' => 'required|exists:aftesite,aftesi_id',
            'niveli'    => 'required|in:fillestar,mesem,avancuar,ekspert',
        ]);

        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();
        if (!$kandidati) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $existing = KandidatAftesia::where('kandidat_id', $kandidati->kandidat_id)
            ->where('aftesi_id', $request->aftesi_id)
            ->first();

        if ($existing) {
            $existing->update(['niveli' => $request->niveli]);
        } else {
            KandidatAftesia::create([
                'kandidat_id' => $kandidati->kandidat_id,
                'aftesi_id'   => $request->aftesi_id,
                'niveli'      => $request->niveli,
            ]);
        }

        return response()->json(['message' => 'Skill assigned successfully']);
    }

    public function removeFromKandidat(Request $request)
    {
        $request->validate(['aftesi_id' => 'required|exists:aftesite,aftesi_id']);

        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();

        KandidatAftesia::where('kandidat_id', $kandidati->kandidat_id)
            ->where('aftesi_id', $request->aftesi_id)
            ->delete();

        return response()->json(['message' => 'Skill removed successfully']);
    }
}