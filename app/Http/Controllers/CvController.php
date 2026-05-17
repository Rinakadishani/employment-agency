<?php

namespace App\Http\Controllers;

use App\Models\CvKandidatit;
use App\Models\Kandidati;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CvController extends Controller
{
    public function index()
    {
        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();
        if (!$kandidati) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $cvt = CvKandidatit::where('kandidat_id', $kandidati->kandidat_id)->get();
        return response()->json(['cvt' => $cvt]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulli_cv' => 'required|string|max:255',
            'skedari'    => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();
        if (!$kandidati) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        $path = $request->file('skedari')->store('cvt', 'public');

        $cv = CvKandidatit::create([
            'kandidat_id' => $kandidati->kandidat_id,
            'titulli_cv'  => $request->titulli_cv,
            'skedari_url' => $path,
            'aktive'      => false,
        ]);

        return response()->json([
            'message' => 'CV uploaded successfully',
            'cv'      => $cv
        ], 201);
    }

    public function setActive(CvKandidatit $cv)
    {
        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();
        if (!$kandidati || $cv->kandidat_id !== $kandidati->kandidat_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Deactivate all CVs
        CvKandidatit::where('kandidat_id', $kandidati->kandidat_id)
            ->update(['aktive' => false]);

        // Activate selected
        $cv->update(['aktive' => true]);

        return response()->json(['message' => 'CV set as active']);
    }

    public function destroy(CvKandidatit $cv)
    {
        $kandidati = Kandidati::where('user_id', auth('api')->id())->first();
        if (!$kandidati || $cv->kandidat_id !== $kandidati->kandidat_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($cv->skedari_url);
        $cv->delete();

        return response()->json(['message' => 'CV deleted successfully']);
    }
}