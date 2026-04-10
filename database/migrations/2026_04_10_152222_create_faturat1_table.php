<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faturat', function (Blueprint $table) {
            $table->id('fature_id');
            $table->foreignId('kompani_id')->references('kompani_id')->on('kompanitë')->onDelete('cascade');
            $table->decimal('shuma', 10, 2);
            $table->string('pershkrimi')->nullable();
            $table->timestamp('data_faturimit')->useCurrent();
            $table->date('data_pageses')->nullable();
            $table->enum('statusi', ['paguar', 'papaguar', 'vonuar'])->default('papaguar');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faturat');
    }
};
