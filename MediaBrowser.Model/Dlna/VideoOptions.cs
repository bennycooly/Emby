﻿namespace MediaBrowser.Model.Dlna
{
    /// <summary>
    /// Class VideoOptions.
    /// </summary>
    public class VideoOptions : AudioOptions
    {
        public int? AudioStreamIndex { get; set; }
        public int? SubtitleStreamIndex { get; set; }
        public int? MaxAudioTranscodingBitrate { get; set; }

        public VideoOptions()
        {
            MaxAudioTranscodingBitrate = 128000;
        }
    }
}