<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('report_books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->references('id')->on('reports')
                ->onDelete('cascade')->onUpdate('cascade');
            $table->string('path_to_report_book');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('report_books');
    }
}
