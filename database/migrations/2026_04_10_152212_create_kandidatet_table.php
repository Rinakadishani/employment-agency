<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kandidatet', function (Blueprint $table) {
            $table->id('kandidat_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('emri');
            $table->string('mbiemri');
            $table->string('email')->unique();
            $table->string('telefoni')->nullable();
            $table->date('data_lindjes')->nullable();
            $table->string('adresa')->nullable();
            $table->string('profesioni')->nullable();
            $table->integer('pervoja_vite')->default(0);
            $table->timestamp('data_regjistrimit')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kandidatet');
    }
};
