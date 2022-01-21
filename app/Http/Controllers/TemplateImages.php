<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\TemplateImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Traits\Store;

class TemplateImages extends Controller
{
    use Store;

    /**
     * return image list with converted src in it, depends on current server and storage position
     */
    public static function getConvertedImageList($imageList) {
        $index = 0;
        foreach ($imageList as $key => $image) {
            $imageList[$index]['src'] = Storage::url($image["src"]);
            $index++;
        }

        return $imageList;
    }

    public function create(Request $request, $reportId) {
        $imageName = $request->post('name') == null ? 'Нове зображення' : $request->post('name');
        TemplateImage::create(
            [
                'report_id' => $reportId,
                'name' => $imageName,
                'src' => $request->hasFile('image') ?
                            $this->saveFile($request->file('image')) : null,
            ]
        );

        return $this->get($reportId);
    }

    public function rename(Request $request, $reportId, $imageId) {
        $image = TemplateImage::find($imageId);
        $image->name = $request->post('name');
        $image->save();

        return $this->get($reportId);
    }

    public function delete($reportId, $imageId) {
        $image = TemplateImage::find($imageId);
        $this->deleteFile($image->src);
        $image->delete();

        return $this->get($reportId);
    }

    public function get($reportId) {
        $imageList = self::getConvertedImageList(Report::find($reportId)->templateImages->toArray());
        return $imageList;
    }
}
