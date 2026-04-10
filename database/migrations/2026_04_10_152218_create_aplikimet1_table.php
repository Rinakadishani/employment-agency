<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aplikimet', function (Blueprint $table) {
            $table->id('aplikim_id');
            $table->foreignId('kandidat_id')->references('kandidat_id')->on('kandidatet')->onDelete('cascade');
            $table->foreignId('vend_id')->references('vend_id')->on('vendet_punes')->onDelete('cascade');
            $table->timestamp('data_aplikimit')->useCurrent();
            $table->enum('statusi', ['pending', 'reviewed', 'intervistuar', 'pranuar', 'refuzuar'])->default('pending');
            $table->text('letra_motivimit')->nullable();
            $table->text('shenimet')->nullable();
            $table->unique(['kandidat_id', 'vend_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aplikimet');
    }
};
