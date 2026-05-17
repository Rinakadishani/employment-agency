<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kandidati extends Model
{
    use HasFactory;

    protected $table = 'kandidatet';
    protected $primaryKey = 'kandidat_id';

    protected $fillable = [
        'user_id', 'emri', 'mbiemri', 'email',
        'telefoni', 'data_lindjes', 'adresa',
        'profesioni', 'pervoja_vite',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aplikimet()
    {
        return $this->hasMany(Aplikimi::class, 'kandidat_id');
    }

    public function cvt()
    {
        return $this->hasMany(CvKandidatit::class, 'kandidat_id');
    }

    public function aftesite()
    {
        return $this->belongsToMany(Aftesia::class, 'kandidat_aftesite', 'kandidat_id', 'aftesi_id')
                    ->withPivot('niveli');
    }
}