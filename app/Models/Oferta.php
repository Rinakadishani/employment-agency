<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    protected $table = 'ofertat';
    protected $primaryKey = 'oferte_id';

    protected $fillable = [
        'aplikim_id', 'paga_ofruar', 'kushtet',
        'data_pergjigjes', 'statusi',
    ];

    public function aplikimi()
    {
        return $this->belongsTo(Aplikimi::class, 'aplikim_id');
    }
}