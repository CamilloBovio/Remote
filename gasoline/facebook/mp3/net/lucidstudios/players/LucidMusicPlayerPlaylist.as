/**
* ...
* @author Sher Ali
*/

import com.bigspaceship.Delegate;
import com.mosesSupposes.fuse.*;

dynamic class net.lucidstudios.players.LucidMusicPlayerPlaylist extends MovieClip {
	
	private var playlistFile:String = "xml/musicPlaylist.xml";
	private var playlistXML:XML;
	
	private var playlistData:Array;
	private var selectedPlaylistItem:MovieClip;
	
	public static var PLAY_MUSIC:String = "playMusic";
	
	public var dispatchEvent:Function;
	public var addEventListener:Function;
	public var removeEventListener:Function;
	
	public function LucidMusicPlayerPlaylist() {
		EventDispatcher.initialize(this);
		ZigoEngine.simpleSetup(PennerEasing, Shortcuts);
	}
	
	private function init(listData:Array):Void {
		playlistData = listData;
		for (var i = 0; i < playlistData.length; i++ ) {
			var playlistItem:MovieClip = this.attachMovie("LucidMusicPlayerPlaylistItem", "playlistItem"+i, i);
			playlistItem._y = playlistItem._height * i;
			playlistItem.theTitle.text = playlistData[i].TITLE;
			playlistItem.ID = i;
			
			playlistItem.onRollOver = Delegate.create(this, playlistItemOver, playlistItem);
			playlistItem.onRollOut = playlistItem.onDragOut = Delegate.create(this, playlistItemOut, playlistItem);
			playlistItem.onRelease = Delegate.create(this, playlistItemClick, playlistItem);
		}
		
		//dispatchEvent( { target:this, type:"playMusic", musicID:0 } );
	}
	public function resetListItemsWidth():Void {
		for (var i = 0; i < playlistData.length; i++ ) {
			var playlistItem:MovieClip = this["playlistItem" + i];
			playlistItem._width += 9;
			playlistItem.theTitle._width = Math.round(playlistItem._width) - 10;
		}
	}
	private function playlistItemOver(playlistItem:MovieClip):Void {
		playlistItem.bg.colorTo(0x151515, 1, "easeOutExpo");
		playlistItem.theTitle.colorTo(0x00CCFF, 1, "easeOutExpo");
	}
	private function playlistItemOut(playlistItem:MovieClip):Void {
		playlistItem.bg.colorTo(null, 1, "easeOutExpo");
		playlistItem.theTitle.colorTo(null, 1, "easeOutExpo");
	}
	private function playlistItemClick(playlistItem:MovieClip):Void {
		setSelectedPlaylistItem(playlistItem);
		_parent.playMusic(playlistItem.ID);
		//dispatchEvent( { target:this, type:"playMusic", musicID:playlistItem.ID } );
	}
	
	private function setSelectedPlaylistItem(playlistItem:MovieClip):Void {
		//restore previously selected playlistItem in original state
		selectedPlaylistItem.enabled = true;
		selectedPlaylistItem.bg.colorTo(null, 1, "easeOutExpo");
		selectedPlaylistItem.theTitle.colorTo(null, 1, "easeOutExpo");
		
		//show the selected playlistItem in selected state
		selectedPlaylistItem = playlistItem;
		selectedPlaylistItem.bg.colorTo(0x151515, 1, "easeOutExpo");
		selectedPlaylistItem.theTitle.colorTo(0x00CCFF, 1, "easeOutExpo");
		selectedPlaylistItem.enabled = false;
	}
	
	public function setSelected(ID:Number):Void {
		setSelectedPlaylistItem(this["playlistItem"+ID]);
	}
	
}