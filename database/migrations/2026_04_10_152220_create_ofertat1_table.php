<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ofertat', function (Blueprint $table) {
            $table->id('oferte_id');
            $table->foreignId('aplikim_id')->references('aplikim_id')->on('aplikimet')->onDelete('cascade');
            $table->unsignedInteger('paga_ofruar');
            $table->text('kushtet')->nullable();
            $table->timestamp('data_ofertes')->useCurrent();
            $table->date('data_pergjigjes')->nullable();
            $table->enum('statusi', ['pending', 'pranuar', 'refuzuar'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ofertat');
    }
};
