/**
* ...
* @author Sher Ali
*/

import net.lucidstudios.utils.*;
import com.bigspaceship.Delegate;
import com.mosesSupposes.fuse.*;

dynamic class net.lucidstudios.players.LucidMusicPlayer extends MovieClip {
	
	private var playlistFile:String = "xml/musicPlaylist.xml";
	private var playlistXML:XML;
	
	private var albumCoverLoader:MovieClipLoader;
	
	private var playlistData:Array;
	private var musicPlayerListener:Object;
	private var currentMusicID:Number = -1;
	
	private var musicLoader:Sound;
	private var musicLoadInterval:Number;
	private var musicPlayInterval:Number;
	
	private var isStopped:Boolean;
	private var isPuased:Boolean = false;
	private var isMuted:Boolean = false;
	private var playheadBeingDragged:Boolean = false;
	private var lastPlayheadPosition:Number = 0;
	private var volumeSliderBeingDragged:Boolean = false;
	private var lastSavedVolume:Number = 50;
	private var isFirstSong:Boolean = true;
	
	private var _bufferTime:Number = 5;
	private var _loop:Boolean = true;
	private var _showScrollBar:Boolean = true;
	private var _showPlaylist:Boolean = true;
	private var _autoPlay:Boolean = true;
	
	public var playerBtnBGOverColor:Number = 0x151515;
	public var playerBtnBorderOverColor:Number = 0x333333;
	public var playerBtnSignOverColor:Number = 0xFFFFFF;
	
	public function LucidMusicPlayer() {
		ZigoEngine.simpleSetup(PennerEasing, Shortcuts);
		
		this.progressBars.playingBar._width = 0;
		this.progressBars.loadingBar._width = 0;
		
		if (_root.playlistFile != undefined) {
			this.playlistFile = _root.playlistFile;
		}
		if (_root.bufferTime != undefined) {
			this.bufferTime = Number(_root.bufferTime);
		}
		if (_root.showScrollBar != undefined) {
			this.showScrollBar = _root.showScrollBar == "no" ? false : true;
		}
		if (_root.loop != undefined) {
			this.loop = _root.loop == "no" ? false : true;
		}
		if (_root.showPlaylist != undefined) {
			if (_root.showPlaylist == "no") {
				this.showPlaylist = false;
				this.playlist._visible = false;
				this.fullBorder._visible = false;
				this.scroller._visible = false;
				this.scrollB._visible = false;
			}
			else {
				this.showPlaylist = true;
			}
		}
		
		if (_root.autoPlay != undefined) {
			if (_root.autoPlay == "no") {
				this.autoPlay = false;
				isPuased = true;
			}
			else {
				this.autoPlay = true;
				isPuased = false;
			}
			
		}
		
		this.musicTitle.html = true;
		this.musicTitle.htmlText = '<font color="#333333">NOW PLAYING: </font><br />...';
		
		this.musicInfo.text = "0:0 / 0:0";
		
		init();
	}
	public function init():Void{
		loadXML();
	}
	
	private function loadXML():Void {
		playlistXML = new XML();
		playlistXML.ignoreWhite = true;
		playlistXML.onLoad = Delegate.create(this, parseXML);
		playlistXML.load(playlistFile);
	}
	private function parseXML():Void {
		playlistData = new Array();
		
		var playlistNodes:Array = playlistXML.firstChild.childNodes;
		for (var i = 0; i < playlistNodes.length; i++) {
			var musicNode:Object = new Object();
			/* .toUpperCase() at the end of the following line converts the title of the music file into uppercase
			 * if don't want the titles to be converted into uppercase then just remove the .toUpperCase() portion
			*/
			musicNode.TITLE = playlistNodes[i].attributes.title.toUpperCase();
			musicNode.MUSIC = playlistNodes[i].attributes.music;
			musicNode.ALBUM_COVER = playlistNodes[i].attributes.albumCover;
			playlistData.push(musicNode);
		}
		
		iniPlayer();
	}
	
	private function iniPlayer():Void {
		this.playlist.addEventListener("playMusic", Delegate.create(this, playMusicHandler));
		this.playlist.init(playlistData);
		
		if (this.showPlaylist) {
			this.updateScrollAmount();
		}
		
		
		//add event listeners for the user interface buttons
		this.playBtn.onRollOver = Delegate.create(this, btnOverHandler, this.playBtn);
		this.playBtn.onRollOut = this.playBtn.onDragOut = Delegate.create(this, btnOutHandler, this.playBtn);
		this.playBtn.onRelease = Delegate.create(this, playPauseMusic);
		
		this.pauseBtn.onRollOver = Delegate.create(this, btnOverHandler, this.pauseBtn);
		this.pauseBtn.onRollOut = this.pauseBtn.onDragOut = Delegate.create(this, btnOutHandler, this.pauseBtn);
		this.pauseBtn.onRelease = Delegate.create(this, playPauseMusic);
		
		this.stopBtn.onRollOver = Delegate.create(this, btnOverHandler, this.stopBtn);
		this.stopBtn.onRollOut = this.stopBtn.onDragOut = Delegate.create(this, btnOutHandler, this.stopBtn);
		this.stopBtn.onRelease = Delegate.create(this, stopMusic);
		
		this.prevBtn.onRollOver = Delegate.create(this, btnOverHandler, this.prevBtn);
		this.prevBtn.onRollOut = this.prevBtn.onDragOut = Delegate.create(this, btnOutHandler, this.prevBtn);
		this.prevBtn.onRelease = Delegate.create(this, playPrevMusic);
		
		this.nextBtn.onRollOver = Delegate.create(this, btnOverHandler, this.nextBtn);
		this.nextBtn.onRollOut = this.nextBtn.onDragOut = Delegate.create(this, btnOutHandler, this.nextBtn);
		this.nextBtn.onRelease = Delegate.create(this, playNextMusic);
		
		this.progressBars.playheadBtn.onRollOver = Delegate.create(this, btnOverHandler, this.progressBars.playheadBtn);
		this.progressBars.playheadBtn.onRollOut = this.progressBars.playheadBtn.onDragOut = Delegate.create(this, btnOutHandler, this.progressBars.playheadBtn);
		this.progressBars.playheadBtn.onPress = Delegate.create(this, startDraggingPlayhead);
		this.progressBars.playheadBtn.onRelease = this.progressBars.playheadBtn.onReleaseOutside = Delegate.create(this, stopDraggingPlayhead);
		
		this.progressBars.bg.onRelease = Delegate.create(this, progressBGClickHandler);
		
		this.speakerBtn.onRollOver = Delegate.create(this, btnOverHandler, this.speakerBtn);
		this.speakerBtn.onRollOut = this.speakerBtn.onDragOut = Delegate.create(this, btnOutHandler, this.speakerBtn);
		this.speakerBtn.onRelease = Delegate.create(this, muteMusic);
		
		this.volumeSlider.onRollOver = Delegate.create(this, btnOverHandler, this.volumeSlider);
		this.volumeSlider.onRollOut = this.volumeSlider.onDragOut = Delegate.create(this, btnOutHandler, this.volumeSlider);
		this.volumeSlider.onPress = Delegate.create(this, startDraggingVolumeSlider);
		this.volumeSlider.onRelease = this.volumeSlider.onReleaseOutside = Delegate.create(this, stopDraggingVolumeSlider);
		
		
		if (isPuased) {
			this.pauseBtn._visible = false;
		}
		else {
			this.playBtn._visible = false;
		}
		
		//set the sound buffer time
		_global._soundbuftime = this.bufferTime;
		
		//if autoPlay is true/yes then auto start player and load the first music track
		if (this.autoPlay) {
			isFirstSong = false;
			loadNextMusic();
		}
		else {
			albumCoverLoader = new MovieClipLoader();
			var albumListenerObj:Object = new Object();
			albumCoverLoader.addListener(albumListenerObj);
			albumCoverLoader.loadClip(playlistData[0].ALBUM_COVER, this.albumCoverHolder.albumCover);
			this.albumCoverHolder.albumCover._alpha = 0;
			
			albumListenerObj.onLoadStart = Delegate.create(this, albumLoadStartHandler);
			albumListenerObj.onLoadInit = Delegate.create(this, albumLoadInitHandler);
		}
	}
	
	private function btnOverHandler(btn:MovieClip):Void {
		btn.bg.colorTo(playerBtnBGOverColor, 1, "easeOutExpo");
		btn.border.colorTo(playerBtnBorderOverColor, 1, "easeOutExpo");
		btn.sign.colorTo(playerBtnSignOverColor, 1, "easeOutExpo");
	}
	private function btnOutHandler(btn:MovieClip):Void {
		btn.bg.colorTo(null, 1, "easeOutExpo");
		btn.border.colorTo(null, 1, "easeOutExpo");
		btn.sign.colorTo(null, 1, "easeOutExpo");
	}
	private function playerBtnClick(btn:MovieClip):Void {
		//stop previous music if any is playing/loading
		stopCurrentMusic();
		
		switch(btn) {
			//check which player button is clicked
			case this.nextBtn:
				loadNextMusic();
				break;
			case this.prevBtn:
				loadPrevMusic();
				break;
		}
		//update status of the buttons on each button click
		updatePlayerBtns();
	}
	private function updatePlayerBtns():Void{
		//
		if ( currentImgID == projectsData.length - 1 ) {
			//disable the right button and lower the opacity
			this.nextBtn.enabled = false;
			this.nextBtn._alpha = 50;
			this.nextBtn.colorTo(null, .5, "easeOutSine");
		}
		else {
			//enable right button
			this.nextBtn.enabled = true;
			this.nextBtn._alpha = 100;
		}
		if ( currentImgID == 0 ) {
			//disable the left button and lower the opacity
			this.prevBtn.enabled = false;
			this.prevBtn._alpha = 50;
			this.prevBtn.colorTo(null, .5, "easeOutSine");
		}
		else {
			//enable the prev button
			this.prevBtn.enabled = true;
			this.prevBtn._alpha = 100;
		}
	}
	private function updateTitle():Void {
		//show the current playing music's title in uppercase
		//you can remove the .toUpperCase() part for not showing title in uppercase
		this.musicTitle.htmlText = '<font color="#333333">NOW PLAYING: </font><br />' + this.playlistData[this.currentMusicID].TITLE.toUpperCase();
	}
	
	
	private function getMusicID(offset:Number):Number {
		//returns the new value of currentMusicID based on the passed offset value
		var id:Number = currentMusicID;
		id += offset;
		
		if ( id < 0 ) {
			id += playlistData.length;
		}
		else {
			id %= playlistData.length;
		}
		currentMusicID = id;
		return currentMusicID;
	}

	private function loadNextMusic():Void {
		//loads the next music
		beginLoadMusic(getMusicID(1));
	}
	private function loadPrevMusic():Void {
		//loads the previous music
		beginLoadMusic(getMusicID( -1));
	}
	
	public function playMusic(ID:Number):Void {
		clearIntervals();
		this.progressBars.playingBar._width = 0;
		this.progressBars.playheadBtn._x = 0;
		//clearInterval(musicLoadInterval);
		
		this.currentMusicID = ID;
		beginLoadMusic(ID);
	}
	private function clearIntervals():Void {
		clearInterval(musicLoadInterval);
	}
	private function beginLoadMusic(ID:Number):Void {
		clearInterval(musicPlayInterval);
		if (isPuased) {
			this.pauseBtn._visible = true;
			this.playBtn._visible = false;
		}
		isPuased = false;
		
		//load new music file
		musicLoader = new Sound();
		musicLoader.onSoundComplete = Delegate.create(this, musicPlayHandler);
		musicLoader.loadSound(playlistData[ID].MUSIC, true);
		
		//start intervals for displaying the loading and playing progress
		musicPlayInterval = setInterval(this, "checkPlayProgress", 100);
		musicLoadInterval = setInterval(this, "checkLoadProgress", 100);
		
		this.updateTitle();
		this.playlist.setSelected(this.currentMusicID);
		
		musicLoader.setVolume((this.volumeSlider._x - this.volumeBar._x) * 2);
		
		loadAlbumCover();
	}
	private function loadAlbumCover():Void {
		albumCoverLoader = new MovieClipLoader();
		var albumListenerObj:Object = new Object();
		albumCoverLoader.addListener(albumListenerObj);
		albumCoverLoader.loadClip(playlistData[this.currentMusicID].ALBUM_COVER, this.albumCoverHolder.albumCover);
		this.albumCoverHolder.albumCover._alpha = 0;
		
		albumListenerObj.onLoadStart = Delegate.create(this, albumLoadStartHandler);
		albumListenerObj.onLoadInit = Delegate.create(this, albumLoadInitHandler);
	}
	private function albumLoadStartHandler(target:MovieClip):Void {
		this.albumCoverHolder.albumPreloader._visible = true;
		this.albumCoverHolder.albumPreloader._alpha = 100;
	}
	private function albumLoadInitHandler(target:MovieClip):Void {
		this.albumCoverHolder.albumCover.alphaTo(100, 1, "easeOutSine");
		this.albumCoverHolder.albumPreloader.alphaTo(0, .5, "easeOutSine", null, {scope:null, func:function(){
			this.albumCoverHolder.albumPreloader._visible = false;
		}});
	}
	private function musicLoadHandler():Void {
		//musicLoader.start(0, 1000);
		/*musicLoader.start(0, 9999999);	
		musicPlayInterval = setInterval(this, "checkPlayProgress", 100);
		clearInterval(musicLoadInterval);*/
	}
	private function musicPlayHandler():Void {
		if (this.loop) {
			loadNextMusic();
		}
		else {
			//reset timing info
			this.musicInfo.text = "0:0 / " + NumberConvertor.convertToMinutes(Math.round(musicLoader.duration/1000));
			clearInterval(musicPlayInterval);
			
			this.pauseBtn._visible = false;
			this.playBtn._visible = true;
			
			this.progressBars.playingBar._width = 0;
			this.progressBars.playheadBtn._x = 0;
			
			isPuased = true;
			isStopped = true;
		}		
	}
	private function checkLoadProgress():Void {
		//this function updates the loading bar
		var loadedBytes:Number = musicLoader.getBytesLoaded();
		var totalBytes:Number = musicLoader.getBytesTotal();
		var percentBytes:Number = Math.round(loadedBytes * 100 / totalBytes);
		
		this.progressBars.loadingBar._width = percentBytes * (this.progressBars.bg._width/100);
		
		if (percentBytes == 100) {
			//musicLoader.start(0, 9999999);
			//musicPlayInterval = setInterval(this, "checkPlayProgress", 100);
			clearInterval(musicLoadInterval);
		}
	}
	private function checkPlayProgress():Void {
		//this function updates the playing bar
		var musicPosition:Number = musicLoader.position;
		var musicDuration:Number = musicLoader.duration;
		
		var bytesL:Number = musicLoader.getBytesLoaded();
		var bytesT:Number = musicLoader.getBytesTotal();
		
		var percentBuffered:Number = bytesL/bytesT;
		musicDuration /= percentBuffered;
		
		var currentPositionInPercent:Number = musicPosition / musicDuration;
		
		if (!playheadBeingDragged) {
			this.progressBars.playingBar._width = currentPositionInPercent * this.progressBars.bg._width;
			this.progressBars.playheadBtn._x = currentPositionInPercent * this.progressBars.bg._width;
		}
		
		//calculate and show the current playing music file's time info
		this.musicInfo.text = NumberConvertor.convertToMinutes(Math.round(musicLoader.position/1000)) + " / " + NumberConvertor.convertToMinutes(Math.round(musicLoader.duration/1000));
	}
	private function progressBGClickHandler():Void {
		this.progressBars.playheadBtn._x = this.progressBars.playingBar._width = this.progressBars._xmouse;
		lastPlayheadPosition = this.progressBars.playheadBtn._x - this.progressBars.bg._x;
		
		if(!isPuased){
			musicLoader.start(((musicLoader.duration * (this.progressBars.playheadBtn._x - this.progressBars.bg._x)) / this.progressBars.bg._width)/1000);
		}
	}
	private function startDraggingPlayhead():Void {
		this.progressBars.playheadBtn.startDrag(true, this.progressBars.bg._x, this.progressBars.playheadBtn._y, this.progressBars.bg._x + this.progressBars.bg._width, this.progressBars.playheadBtn._y);
		this.progressBars.playheadBtn.onEnterFrame = Delegate.create(this, checkPlayheadDragging);
		playheadBeingDragged = true;
	}
	private function stopDraggingPlayhead():Void {
		delete this.progressBars.playheadBtn.onEnterFrame;
		playheadBeingDragged = false;
		this.progressBars.playheadBtn.stopDrag();
		lastPlayheadPosition = this.progressBars.playheadBtn._x - this.progressBars.bg._x;
		
		if(!isPuased){
			musicLoader.start(((musicLoader.duration * (this.progressBars.playheadBtn._x - this.progressBars.bg._x)) / this.progressBars.bg._width)/1000);
		}
		
		//update music timing info
		this.musicInfo.text = NumberConvertor.convertToMinutes(((musicLoader.duration * (this.progressBars.playheadBtn._x - this.progressBars.bg._x)) / this.progressBars.bg._width)/1000) + " / " + NumberConvertor.convertToMinutes(Math.round(musicLoader.duration / 1000));
		
		//trace(((musicLoader.duration * (this.progressBars.playheadBtn._x - this.progressBars.bg._x)) / this.progressBars.bg._width)/1000);
		//getNetStreamObj().seek((video_length*(controls_mc.video_playhead_mc.x-play_head_starting_point))/controls_mc.track_mc.width);
		/*lastSavedVolume = this.volumeSlider._x - this.volumeBar._x;
		if ( lastSavedVolume == 0 ) {
			musicLoader.setVolume(0);
			isMuted = true;
		}*/
	}
	private function checkPlayheadDragging():Void {
		this.progressBars.playingBar._width = this.progressBars.playheadBtn._x;
		/*lastSavedVolume = this.volumeSlider._x - this.volumeBar._x;
		musicLoader.setVolume(lastSavedVolume * 2);*/
	}
	
	private function playPauseMusic():Void {
		if (isFirstSong) {
			isFirstSong = false;
			loadNextMusic();
		}
		else {
			if (isPuased) {
				//musicLoader.start();
				/*if (musicLoader.position < musicLoader.duration) {
					musicLoader.start(musicLoader.position / 1000);
				} else {
					musicLoader.start();
				}*/
				if (isStopped) {
					musicLoader.start(((musicLoader.duration * (this.progressBars.playheadBtn._x - this.progressBars.bg._x)) / this.progressBars.bg._width)/1000);
				} else {
					//musicLoader.start(musicLoader.position / 1000);
					musicLoader.start(((musicLoader.duration * (this.progressBars.playheadBtn._x - this.progressBars.bg._x)) / this.progressBars.bg._width)/1000);
				}
				musicPlayInterval = setInterval(this, "checkPlayProgress", 100);
				
				this.pauseBtn._visible = true;
				this.playBtn._visible = false;
			}
			else {
				musicLoader.stop();
				clearInterval(musicPlayInterval);
				lastPlayheadPosition = this.progressBars.playheadBtn._x - this.progressBars.bg._x;
				
				this.pauseBtn._visible = false;
				this.playBtn._visible = true;
			}
			isPuased = !isPuased;
		}
	}
	private function stopMusic():Void {
		this.musicInfo.text = "0:0 / " + NumberConvertor.convertToMinutes(Math.round(musicLoader.duration/1000));
		isPuased = true;
		isStopped = true;
		
		this.progressBars.playingBar._width = 0;
		this.progressBars.playheadBtn._x = 0;  
		
		musicLoader.stop();
		clearInterval(musicPlayInterval);
		
		this.pauseBtn._visible = false;
		this.playBtn._visible = true;
	}
	private function playPrevMusic(btn:MovieClip):Void {
		this.playMusic(getMusicID( -1));
	}
	private function playNextMusic(btn:MovieClip):Void {
		this.playMusic(getMusicID(1));
	}
	
	private function muteMusic():Void {
		if(isMuted){
			musicLoader.setVolume(lastSavedVolume * 2);
			this.volumeSlider._x = this.volumeBar._x + lastSavedVolume;
			//trace(lastSavedVolume);
		}
		else {
			musicLoader.setVolume(0);
			this.volumeSlider._x = this.volumeBar._x;
		}
		isMuted = !isMuted;
	}
	private function startDraggingVolumeSlider():Void {
		this.volumeSlider.startDrag(true, this.volumeBar._x, this.volumeSlider._y, this.volumeBar._x + this.volumeBar._width, this.volumeSlider._y);
		this.volumeSlider.onEnterFrame = Delegate.create(this, checkVolumeSliderDragging);
		volumeSliderBeingDragged = true;
	}
	private function stopDraggingVolumeSlider():Void {
		delete this.volumeSlider.onEnterFrame;
		volumeSliderBeingDragged = false;
		this.volumeSlider.stopDrag();
		lastSavedVolume = this.volumeSlider._x - this.volumeBar._x;
		if ( lastSavedVolume == 0 ) {
			musicLoader.setVolume(0);
			isMuted = true;
		}
		/*else {
			musicLoader.setVolume(lastSavedVolume * 2);
			isMuted = false;
		}*/
	}
	private function checkVolumeSliderDragging():Void {
		lastSavedVolume = this.volumeSlider._x - this.volumeBar._x;
		musicLoader.setVolume(lastSavedVolume * 2);
		//trace(lastSavedVolume * 2);
	}
	
	
	private function musicLoadedHandler(obj:Object):Void {
		
	}
	private function musicPlayedHandler(obj:Object):Void {
		//trace('yes');
	}
	private function playMusicHandler(obj:Object):Void {
		//trace('yes');
	}
	
	public function pauseMusicPlayer():Void {
		if (!isPuased) {
			playPauseMusic();
		}
	}
	
	
	public function set bufferTime(bufferValue:Number):Void {
		_bufferTime = bufferValue;
	}
	public function get bufferTime():Number {
		return _bufferTime;
	}
	public function set showScrollBar(scrollBarFlag:Boolean):Void {
		_showScrollBar = scrollBarFlag;
	}
	public function get showScrollBar():Boolean {
		return _showScrollBar;
	}
	public function set loop(loopFlag:Boolean):Void {
		_loop = loopFlag;
	}
	public function get loop():Boolean {
		return _loop;
	}
	public function set showPlaylist(showPlaylistFlag:Boolean):Void {
		_showPlaylist = showPlaylistFlag;
	}
	public function get showPlaylist():Boolean {
		return _showPlaylist;
	}
	public function set autoPlay(autoPlayFlag:Boolean):Void {
		_autoPlay = autoPlayFlag;
	}
	public function get autoPlay():Boolean {
		return _autoPlay;
	}
}