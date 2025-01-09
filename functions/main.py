# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import os
import json
import tempfile
from firebase_functions import https_fn
from firebase_admin import initialize_app
import yt_dlp

initialize_app()

def create_cookie_file():
    cookie_content = f'youtube.com\tTRUE\t/\tTRUE\t2147483647\tCONSENT\tYES+cb.20210328-17-p0.en+FX+123'
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
        f.write(cookie_content)
        return f.name

def get_yt_dlp_params(cookie_file):
    return {
        'no_check_certificates': True,
        'no_warnings': True,
        'prefer_insecure': True,
        'cookiefile': cookie_file,
        'http_headers': {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    }

@https_fn.on_request()
def get_video_info(req: https_fn.Request) -> https_fn.Response:
    if req.method != 'POST':
        return https_fn.Response('Method not allowed', status=405)

    try:
        request_json = req.get_json()
        if not request_json or 'url' not in request_json:
            return https_fn.Response('URL is required', status=400)

        url = request_json['url']
        cookie_file = create_cookie_file()
        ydl_opts = get_yt_dlp_params(cookie_file)

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Format bilgilerini düzenle
            formats = [{
                'formatId': f['format_id'],
                'quality': f.get('quality_label') or f.get('quality'),
                'container': f['ext'],
                'hasAudio': f['acodec'] != 'none',
                'hasVideo': f['vcodec'] != 'none',
                'filesize': f.get('filesize'),
                'fps': f.get('fps'),
                'audioQuality': f'{f["asr"]}Hz' if f.get('asr') else None,
                'videoQuality': f.get('quality_label'),
                'width': f.get('width'),
                'height': f.get('height')
            } for f in info['formats'] if f['ext'] in ['mp4', 'webm']]

            # Altyazıları düzenle
            subtitles = [{
                'language': lang,
                'formats': [{'url': s['url'], 'ext': s['ext']} for s in subs]
            } for lang, subs in (info.get('subtitles') or {}).items()]

            response_data = {
                'title': info['title'],
                'description': info.get('description'),
                'duration': info.get('duration'),
                'thumbnail': info.get('thumbnail'),
                'formats': formats,
                'subtitles': subtitles,
                'tags': info.get('tags'),
                'uploadDate': info.get('upload_date'),
                'uploader': info.get('uploader'),
                'viewCount': info.get('view_count')
            }

        os.unlink(cookie_file)
        return https_fn.Response(json.dumps(response_data), status=200, content_type='application/json')

    except Exception as e:
        return https_fn.Response(str(e), status=500)

@https_fn.on_request()
def get_download_url(req: https_fn.Request) -> https_fn.Response:
    if req.method != 'POST':
        return https_fn.Response('Method not allowed', status=405)

    try:
        request_json = req.get_json()
        if not request_json or 'url' not in request_json:
            return https_fn.Response('URL is required', status=400)

        url = request_json['url']
        format_id = request_json.get('format')
        quality = request_json.get('quality')
        include_subtitles = request_json.get('includeSubtitles', False)
        subtitle_lang = request_json.get('subtitleLang')

        cookie_file = create_cookie_file()
        ydl_opts = get_yt_dlp_params(cookie_file)

        if format_id == 'mp3':
            ydl_opts['format'] = 'bestaudio'
        elif quality:
            ydl_opts['format'] = quality
        else:
            ydl_opts['format'] = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Altyazı URL'si
            subtitle_url = None
            if include_subtitles and subtitle_lang and info.get('subtitles'):
                subtitles = info['subtitles'].get(subtitle_lang, [])
                if subtitles:
                    subtitle_url = subtitles[0]['url']

            response_data = {
                'url': info['url'],
                'title': info['title'],
                'format': format_id or info['ext'],
                'quality': quality or info.get('format_note', 'best'),
                'duration': info.get('duration'),
                'subtitleUrl': subtitle_url,
                'tags': info.get('tags'),
                'thumbnail': info.get('thumbnail')
            }

        os.unlink(cookie_file)
        return https_fn.Response(json.dumps(response_data), status=200, content_type='application/json')

    except Exception as e:
        return https_fn.Response(str(e), status=500)