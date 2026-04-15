<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intervista extends Model
{
    protected $table = 'intervistat';
    protected $primaryKey = 'interviste_id';

    protected $fillable = [
        'aplikim_id', 'data_intervistes', 'ora',
        'lokacioni', 'intervistues_emri', 'rezultati', 'shenimet',
    ];

    public function aplikimi()
    {
        return $this->belongsTo(Aplikimi::class, 'aplikim_id');
    }
}