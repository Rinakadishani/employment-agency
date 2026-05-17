<?php

namespace App\Http\Controllers;

use App\Models\Kandidati;
use App\Models\Kompania;
use App\Models\VendiPunes;
use App\Models\Aplikimi;
use App\Models\Intervista;
use App\Models\Fatura;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'total_kandidatet'   => Kandidati::count(),
            'total_kompanitë'    => Kompania::count(),
            'total_vendet_punes' => VendiPunes::where('statusi', 'aktiv')->count(),
            'total_aplikimet'    => Aplikimi::count(),
            'total_users'        => User::count(),
            'total_intervistat'  => Intervista::count(),
            'faturat_papaguara'  => Fatura::where('statusi', 'papaguar')->count(),
            'faturat_shuma'      => Fatura::where('statusi', 'paguar')->sum('shuma'),

            // Applications by status
            'aplikimet_statusi' => Aplikimi::select('statusi', DB::raw('count(*) as total'))
                ->groupBy('statusi')
                ->get(),

            // Applications per month (last 6 months)
            'aplikimet_per_muaj' => Aplikimi::select(
                    DB::raw('MONTH(created_at) as muaji'),
                    DB::raw('YEAR(created_at) as viti'),
                    DB::raw('count(*) as total')
                )
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('viti', 'muaji')
                ->orderBy('viti')
                ->orderBy('muaji')
                ->get(),

            // Top companies by job count
            'kompanitë_top' => Kompania::withCount('vendetPunes')
                ->orderByDesc('vendet_punes_count')
                ->take(5)
                ->get(),

            // Recent applications
            'aplikimet_recent' => Aplikimi::with(['kandidati', 'vendiPunes.kompania'])
                ->latest()
                ->take(5)
                ->get(),

            // Upcoming interviews
            'intervistat_upcoming' => Intervista::with(['aplikimi.kandidati', 'aplikimi.vendiPunes'])
                ->where('data_intervistes', '>=', now())
                ->orderBy('data_intervistes')
                ->take(5)
                ->get(),
        ];

        return response()->json($stats);
    }
}
