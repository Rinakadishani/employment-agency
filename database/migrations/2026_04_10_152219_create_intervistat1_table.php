<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('intervistat', function (Blueprint $table) {
            $table->id('interviste_id');
            $table->foreignId('aplikim_id')->references('aplikim_id')->on('aplikimet')->onDelete('cascade');
            $table->date('data_intervistes');
            $table->time('ora');
            $table->string('lokacioni')->nullable();
            $table->string('intervistues_emri')->nullable();
            $table->enum('rezultati', ['pending', 'kaloi', 'nuk_kaloi'])->default('pending');
            $table->text('shenimet')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('intervistat');
    }
};
