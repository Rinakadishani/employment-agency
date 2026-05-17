<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    protected $fillable = ['user_id', 'login_provider', 'token_name', 'token_value'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}