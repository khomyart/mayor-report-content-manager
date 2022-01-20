<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Presentation;
use App\Models\Image;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Traits\Store;

class Images extends Controller
{
    use Store;

    /**
     * return image list with converted src in it, depends on current server and storage position
     */
    public function getConvertedImageList($imageList) {
        $index = 0;
        foreach ($imageList as $key => $image) {
            $imageList[$index]['src'] = Storage::url($image["src"]);
            $index++;
        }

        return $imageList;
    }

    public function create(Request $request, $presentationId) {
        $imageName = $request->post('name') == null ? 'Нове зображення' : $request->post('name');
        Image::create(
            [
                'presentation_id' => $presentationId,
                'name' => $imageName,
                'src' => $request->hasFile('image') ?
                            $this->saveFile($request->file('image')) : null,
            ]
        );

        $imageList = $this->getConvertedImageList(Presentation::find($presentationId)->images->toArray());
        return $imageList;
    }

    public function rename(Request $request, $presentationId, $imageId) {
        $image = Image::find($imageId);
        $image->name = $request->post('name');
        $image->save();

        $imageList = $this->getConvertedImageList(Presentation::find($presentationId)->images->toArray());
        return $imageList;
    }

    public function delete($presentationId, $imageId) {
        $image = Image::find($imageId);
        $this->deleteFile($image->src);
        $image->delete();

        $imageList = $this->getConvertedImageList(Presentation::find($presentationId)->images->toArray());
        return $imageList;
    }
}
