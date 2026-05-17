<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CvKandidatit extends Model
{
    protected $table = 'cv_kandidateve';
    protected $primaryKey = 'cv_id';

    protected $fillable = [
        'kandidat_id', 'titulli_cv', 'skedari_url', 'aktive',
    ];

    protected $casts = ['aktive' => 'boolean'];

    public function kandidati()
    {
        return $this->belongsTo(Kandidati::class, 'kandidat_id');
    }
}