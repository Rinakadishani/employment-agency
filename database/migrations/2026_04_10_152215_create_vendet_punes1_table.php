<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendet_punes', function (Blueprint $table) {
            $table->id('vend_id');
            $table->foreignId('kompani_id')->references('kompani_id')->on('kompanitë')->onDelete('cascade');
            $table->string('titulli');
            $table->text('pershkrimi')->nullable();
            $table->text('kerkesat')->nullable();
            $table->string('lloji_kontrates')->nullable();
            $table->unsignedInteger('paga_min')->nullable();
            $table->unsignedInteger('paga_max')->nullable();
            $table->string('lokacioni')->nullable();
            $table->timestamp('data_publikimit')->useCurrent();
            $table->date('afati')->nullable();
            $table->enum('statusi', ['aktiv', 'mbyllur', 'draft'])->default('aktiv');
            $table->index(['kompani_id', 'statusi']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendet_punes');
    }
};
