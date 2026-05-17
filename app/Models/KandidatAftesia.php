<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KandidatAftesia extends Model
{
    protected $table = 'kandidat_aftesite';
    protected $primaryKey = 'ka_id';

    protected $fillable = ['kandidat_id', 'aftesi_id', 'niveli'];
}