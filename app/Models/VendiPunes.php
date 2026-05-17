<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendiPunes extends Model
{
    use HasFactory;

    protected $table = 'vendet_punes';
    protected $primaryKey = 'vend_id';

    protected $fillable = [
        'kompani_id', 'titulli', 'pershkrimi', 'kerkesat',
        'lloji_kontrates', 'paga_min', 'paga_max',
        'lokacioni', 'afati', 'statusi',
    ];

    public function kompania()
    {
        return $this->belongsTo(Kompania::class, 'kompani_id');
    }

    public function aplikimet()
    {
        return $this->hasMany(Aplikimi::class, 'vend_id');
    }
}