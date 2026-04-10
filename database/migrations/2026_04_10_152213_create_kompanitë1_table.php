<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kompanitë', function (Blueprint $table) {
            $table->id('kompani_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('emri_kompanise');
            $table->string('sektori')->nullable();
            $table->string('adresa')->nullable();
            $table->string('personi_kontaktit')->nullable();
            $table->string('email')->nullable();
            $table->string('telefoni')->nullable();
            $table->string('faqja_web')->nullable();
            $table->integer('numri_punonjesve')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kompanitë');
    }
};
