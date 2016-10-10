
function test() {
	//alert( JSON.stringify( localStorage.getItem( 'avocabro_vocabs' ), true ) );
	$( '.vocabs' ).html( '' );
	var v = Avocabro.vocabs.list();
	$( '.vocabs' ).append( 'Count: ' + v.count + '<hr />' );
	for( vocabUID in v[ 'vocabs' ] ) {
		$( '.vocabs' ).append( 'UID <span class="uid-copy" onclick="$( \'.uid\' ).val( $( this ).html() );">' + v.vocabs[ vocabUID ][ 'uid' ] + '</span>; <span onclick="$(\'.v_name\').html( $( this ).html() );test_load(\'' + v.vocabs[ vocabUID ][ 'uid' ] + '\');">' + v.vocabs[ vocabUID ][ 'name' ] + '<hr />' );
	}

}

function test_load( uid ) {
	var c = Avocabro.vocabs.getContents( uid );
	$( '.contents' ).html( '' );
	$( '.contents' ).append( 'Count: ' + c.count + '<hr />' );
	for( entry in c[ 'items' ] ) {
		i = c[ 'items' ][ entry ];
		$( '.contents' ).append( '<span onclick="$(\'.wid\').val(' + entry + ');$( \'.getw\').click();highlight();">' + i[ 'word' ] + '</span> (' + i[ 'type' ] + '): <b>' + i[ 'translation' ] + '</b>; <i>' + i[ 'example' ] + '</i><hr />' );
	}
}
