var avocabro_vocabs = {};
var test_mode = true;

var VocabEntry = {
	'word': '',
	'translation': '',
	'type': '',
	'example': false,
	'last_repeat': 0,
	'ER': 0,
	'MS': 0 // Memorizing state. 0 — только добавлен, 1 — было повторение, ... 6 — слово выучено
};

var Vocab = {
	'entries': [],
	'name': '',
	'last_repeat': 0
};

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

function autoload() {
	// Check if that's the first load of Avocabro
	if( localStorage.getItem( 'avocabro_vocabs:init_passed' ) !== 'true' ) {
		localStorage.setItem( 'avocabro_vocabs', JSON.stringify( {} ) );
		localStorage.setItem( 'avocabro_vocabs:init_passed', 'true' );
	}

	// Loading vocabs
	var vocabs_list = JSON.parse( localStorage.getItem( 'avocabro_vocabs', '{}' ) );
	if( vocabs_list === 'undefined' )
		vocabs_list = {};

	avocabro_vocabs = vocabs_list;
	
	if( test_mode === true ) test();
}

var Avocabro = {
	vocabs: {
		create: function( name ) {
			var UID = _generate_GUID();
			var new_vocab = Vocab;
			new_vocab.name = name;

			avocabro_vocabs[ UID ] = new_vocab;
			Avocabro.service.save();

			return true;
		},

		rename: function( uid, new_name ) {
			avocabro_vocabs[ uid ][ 'name' ] = new_name;
			Avocabro.service.save();
		},

		remove: function( uid ) {
			delete avocabro_vocabs[ uid ];
			Avocabro.service.save();

			return true;
		},

		list: function() {
			var output = {};
			output[ 'count' ] = Object.keys( avocabro_vocabs ).length;
			output[ 'vocabs' ] = [];
			for( vocabUID in avocabro_vocabs ) {
				var vocabData = avocabro_vocabs[ vocabUID ];
				output[ 'vocabs' ].push(
					{ 
						name: vocabData[ 'name' ], 
						items_count: ( vocabData[ 'entries' ] === undefined ? 0 : vocabData[ 'entries' ].length ), 
						last_repeat: vocabData[ 'last_repeat' ],
						uid: vocabUID
					} 
				);
			}

			return output;
		},

		getContents: function( uid ) {
			var output = {};
			var vocab = avocabro_vocabs[ uid ];
			output[ 'items' ] = vocab[ 'entries' ];
			output[ 'count' ] = ( vocab[ 'entries' ] === undefined ? '0' : vocab[ 'entries' ].length );

			return output;
		}
	},

	words: {
		add: function( vocab_uid, word, translation, word_type, example ) {
			var entry = VocabEntry;
			entry.word = word;
			entry.translation = translation;
			entry.type = word_type;
			entry.example = example;

			avocabro_vocabs[ vocab_uid ][ 'entries' ].push( entry );
			
			Avocabro.service.save();
			return entry;
		},

		remove: function( vocab_uid, id_or_word ) {
			if( typeof id_or_word === 'number' )
				avocabro_vocabs[ vocab_uid ][ 'entries' ].splice( id_or_word, 1 );
			else {
				for( entryID in avocabro_vocabs[ vocab_uid ][ 'entries' ] ) {
					var entry = avocabro_vocabs[ vocab_uid ][ 'entries' ][ entryID ];
					if( entry[ 'word' ] === id_or_word )
						avocabro_vocabs[ vocab_uid ][ 'entries' ].splice( entryID, 1 );
				}
			}

			Avocabro.service.save();
			return true;
		},

		getById( vocab_uid, word_id ) {
			return avocabro_vocabs[ vocab_uid ][ 'entries' ][ word_id ];
		}
	},

	service: {
		save: function() {
			localStorage.setItem( 'avocabro_vocabs', JSON.stringify( avocabro_vocabs ) );
			autoload();

			return true;
		},

		bindEvent: function( func, event ) {

		},

		test: function() {
		}
	}
};

function _generate_GUID() {
	function s4() {
		return Math.floor( ( 1 + Math.random() ) * 0x10000 )
		.toString( 16 )
		.substring( 1 );
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}