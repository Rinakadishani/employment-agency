<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aftesite', function (Blueprint $table) {
            $table->id('aftesi_id');
            $table->string('emri_aftesise')->unique();
            $table->string('kategoria')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aftesite');
    }
};
