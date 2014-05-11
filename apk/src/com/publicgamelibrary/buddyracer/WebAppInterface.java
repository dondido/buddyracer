package com.publicgamelibrary.buddyracer;

import java.util.ArrayList;

import android.app.Activity;
import android.content.Context;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.media.MediaPlayer.OnPreparedListener;
import android.net.Uri;
import android.webkit.JavascriptInterface;

	public class WebAppInterface extends Activity{

	    Context mContext;
	    /** Instantiate the interface and set the context */
	    WebAppInterface(Context c) {
	        mContext = c;
	    }
	    //  MediaPlayer m        = null;
	    MediaPlayer mediaPlayer = new  MediaPlayer();
	    ArrayList<MediaPlayer> mps = new ArrayList<MediaPlayer>();
	    ArrayList<String> loops = new ArrayList<String>();
		
	    /** Show a toast from the web page */
	    @JavascriptInterface
	    public void stopSnd() {
	    	loops = new ArrayList<String>();
	    	muteAll();
	    }
	    
	    public void muteAll() {
	    	
	    	for (int i = mps.size() - 1; i >= 0; --i) { //changed ++i to --i
	            if (mps.get(i).isPlaying()) {
	                mps.get(i).stop();
	            }
	            mps.remove(i);
	        }
	    }
	    
	    public void resumeSnd() {
	    	for (int i = loops.size() - 1; i >= 0; --i) { //changed ++i to --i
	    		playSnd(loops.get(i),"true");
	        }
	    }
	    
	    //JavascriptInterface
	    @JavascriptInterface
	    public void playSnd(String toast, String looping) {
	    	//toast+=".mp3";
	    	//Log.e("I", toast);
	    	String uriStr = "android.resource://"+mContext.getPackageName()+"/raw/" + toast;
	    	Uri uri=Uri.parse(uriStr);
	    	//Log.e("I",  uri.toString());
	    	 try {
	    	        mediaPlayer = MediaPlayer.create(mContext, uri);
	    	    	Boolean loop = Boolean.valueOf(looping);
	    	        mediaPlayer.setLooping(loop);
	    	        if(loop){
	    	        	loops.add(toast);
	    	        }
	    	       
	    			// MediaPlayer player = MediaPlayer.create(this, R.raw.laser);
	    	        mediaPlayer.setOnPreparedListener(new OnPreparedListener() { 
	    			        @Override
	    			        public void onPrepared(MediaPlayer mp) {
	    			            mp.start();
	    			            mps.add(mp);
	    			        }
	    			 });
	    	        
	    	        mediaPlayer.setOnCompletionListener(new OnCompletionListener(){
	    	        	public void onCompletion(MediaPlayer mp) {
	    	                // TODO Auto-generated method stub
	    	        		for (int i = mps.size() - 1; i >= 0; --i) { //changed ++i to --i
	    	    	            if (mps.get(i).equals(mp)) {
	    	    	               mps.remove(i);
	    	    	               mp.release();
	    	    	            }
	    	    	        }
	    	            }
	    	        });
	    	    } catch (Exception e) {
	    	    	//Log.i("I",  mContext.getAssets().toString());
	    	    }
	    }
}
