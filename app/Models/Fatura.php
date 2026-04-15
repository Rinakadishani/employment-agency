<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fatura extends Model
{
    protected $table = 'faturat';
    protected $primaryKey = 'fature_id';

    protected $fillable = [
        'kompani_id', 'shuma', 'pershkrimi',
        'data_pageses', 'statusi',
    ];

    public function kompania()
    {
        return $this->belongsTo(Kompania::class, 'kompani_id');
    }
}