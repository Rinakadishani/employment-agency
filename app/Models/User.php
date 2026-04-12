<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'emri', 'mbiemri', 'email', 'password',
        'phone_number', 'email_confirmed',
        'lockout_enabled', 'access_failed_count', 'statusi',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password'        => 'hashed',
            'email_confirmed' => 'boolean',
            'statusi'         => 'boolean',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function claims()
    {
        return $this->hasMany(UserClaim::class);
    }

    public function tokens()
    {
        return $this->hasMany(UserToken::class);
    }

    public function refreshTokens()
    {
        return $this->hasMany(RefreshToken::class);
    }

    public function kandidati()
    {
        return $this->hasOne(Kandidati::class);
    }

    public function kompania()
    {
        return $this->hasOne(Kompania::class);
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()->where('emertimi', $role)->exists();
    }
}