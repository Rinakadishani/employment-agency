<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aplikimi extends Model
{
    use HasFactory;

    protected $table = 'aplikimet';
    protected $primaryKey = 'aplikim_id';

    protected $fillable = [
        'kandidat_id', 'vend_id', 'statusi',
        'letra_motivimit', 'shenimet',
    ];

    public function kandidati()
    {
        return $this->belongsTo(Kandidati::class, 'kandidat_id');
    }

    public function vendiPunes()
    {
        return $this->belongsTo(VendiPunes::class, 'vend_id');
    }

    public function intervistat()
    {
        return $this->hasMany(Intervista::class, 'aplikim_id');
    }

    public function oferta()
    {
        return $this->hasOne(Oferta::class, 'aplikim_id');
    }
}