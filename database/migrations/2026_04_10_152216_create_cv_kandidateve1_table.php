<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_kandidateve', function (Blueprint $table) {
            $table->id('cv_id');
            $table->foreignId('kandidat_id')->references('kandidat_id')->on('kandidatet')->onDelete('cascade');
            $table->string('titulli_cv');
            $table->string('skedari_url');
            $table->timestamp('data_ngarkimit')->useCurrent();
            $table->boolean('aktive')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cv_kandidateve');
    }
};
