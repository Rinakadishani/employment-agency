<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PunonjesiAgjencise extends Model
{
    protected $table = 'punonjesit_agjencise';
    protected $primaryKey = 'punonjes_id';

    protected $fillable = [
        'user_id', 'emri', 'mbiemri', 'email',
        'telefoni', 'roli', 'aktiv',
    ];

    protected $casts = ['aktiv' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}