<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kompania extends Model
{
    use HasFactory;

    protected $table = 'kompanitë';
    protected $primaryKey = 'kompani_id';

    protected $fillable = [
        'user_id', 'emri_kompanise', 'sektori', 'adresa',
        'personi_kontaktit', 'email', 'telefoni',
        'faqja_web', 'numri_punonjesve',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vendetPunes()
    {
        return $this->hasMany(VendiPunes::class, 'kompani_id');
    }

    public function faturat()
    {
        return $this->hasMany(Fatura::class, 'kompani_id');
    }
}