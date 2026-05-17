<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aftesia extends Model
{
    protected $table = 'aftesite';
    protected $primaryKey = 'aftesi_id';

    protected $fillable = ['emri_aftesise', 'kategoria'];

    public function kandidatet()
    {
        return $this->belongsToMany(Kandidati::class, 'kandidat_aftesite', 'aftesi_id', 'kandidat_id')
                    ->withPivot('niveli');
    }
}