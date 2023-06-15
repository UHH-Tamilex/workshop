(function () {
    'use strict';

    /**
     * Sanscript
     *
     * Sanscript is a Sanskrit transliteration library. Currently, it supports
     * other Indian languages only incidentally.
     *
     * Released under the MIT and GPL Licenses.
     */

    const Sanscript = {};

    Sanscript.defaults = {
        skip_sgml: false,
        syncope: false
    };

    var schemes = Sanscript.schemes = {
            tamil: {
                vowels: ['அ','ஆ',
                'இ','ஈ',
                'உ','ஊ',
                '𑌋','𑍠',
                '𑌌','𑍡',
                'எ','ஏ','ஐ',
                'ஒ','ஓ','ஔ'],
                vowel_marks: ['ா',
                'ி','ீ',
                'ு','ூ',
                '𑍃','𑍄',
                '𑍢','𑍣',
                'ெ','ே','ை',
                'ொ','ோ','ௌ'],
                other_marks: ['𑌂','𑌃','𑌁','','','ஃ'], // ṃ ḥ m̐ ẖ ḫ ḵ 
                virama: ['்'],
                consonants: ['க','𑌖','𑌗','𑌘','ங',
                'ச','𑌛','ஜ','𑌝','ஞ',
                'ட','𑌠','𑌡','𑌢','ண',
                'த','𑌥','𑌦','𑌧','ந',
                'ப','𑌫','𑌬','𑌭','ம',
                'ய','ர','ல','வ',
                'ஶ','ஷ','ஸ','ஹ',
                'ள','ழ','ற','ன'],
                symbols: ['௦','௧','௨','௩','௪','௫','௬','௭','௮','௯','ௐ','','𑌽','।','॥','௰','௱','௲'],
            },
            
            grantha: {
                vowels: ['𑌅','𑌆',
                    '𑌇','𑌈',
                    '𑌉','𑌊',
                    '𑌋','𑍠',
                    '𑌌','𑍡',
                    'எ','𑌏','𑌐',
                    'ஒ','𑌓','𑌔'
                  
                ],
                vowel_marks: ['𑌾',
                    '𑌿','𑍀',
                    '𑍁','𑍂',
                    '𑍃','𑍄',
                    '𑍢','𑍣',
                    'ெ','𑍇','𑍈',
                    'ொ','𑍋','𑍌'
                ],
                other_marks: ['𑌂','𑌃','𑌁','𑍞','𑍟','ஃ'], // ṃ ḥ m̐ ẖ ḫ ḵ 
                virama: ['𑍍'],
                consonants: ['𑌕','𑌖','𑌗','𑌘','𑌙',
                    '𑌚','𑌛','𑌜','𑌝','𑌞',
                    '𑌟','𑌠','𑌡','𑌢','𑌣',
                    '𑌤','𑌥','𑌦','𑌧','𑌨',
                    '𑌪','𑌫','𑌬','𑌭','𑌮',
                    '𑌯','𑌰','𑌲','𑌵',
                    '𑌶','𑌷','𑌸','𑌹',
                    '𑌳','ழ','ற','ன',
                ],
                symbols: ['௦','௧','௨','௩','௪','௫','௬','௭','௮','௯','𑍐','','𑌽','।','॥','௰','௱','௲'],
            },
            
            malayalam: {
                vowels: ['അ','ആ',
                    'ഇ','ഈ',
                    'ഉ','ഊ',
                    'ഋ','ൠ',
                    'ഌ','ൡ',
                    'എ','ഏ','ഐ',
                    'ഒ','ഓ','ഔ'
                ],
                vowel_marks: ['ാ',
                    'ി','ീ',
                    'ു','ൂ',
                    'ൃ','ൄ',
                    'ൢ','ൣ',
                    'െ','േ','ൈ',
                    'ൊ','ോ','ൌ'
                ],
                other_marks: ['ം','ഃ','ഁ','','',''],
                virama: ['്'],
                consonants: ['ക','ഖ','ഗ','ഘ','ങ',
                    'ച','ഛ','ജ','ഝ','ഞ',
                    'ട','ഠ','ഡ','ഢ','ണ',
                    'ത','ഥ','ദ','ധ','ന',
                    'പ','ഫ','ബ','ഭ','മ',
                    'യ','ര','ല','വ',
                    'ശ','ഷ','സ','ഹ',
                    'ള','ഴ','റ','ഩ'
                ],
                symbols: ['൦','൧','൨','൩','൪','൫','൬','൭','൮','൯','ഒം','','ഽ','।','॥','൰','൱','൲'],
            },
            
            newa: {
                vowels: ['𑐀','𑐁',
                    '𑐂','𑐃',
                    '𑐄','𑐅',
                    '𑐆','𑐇',
                    '𑐈','𑐉',
                    '','𑐊','𑐋',
                    '','𑐌','𑐍'
                ],
                vowel_marks: ['𑐵',
                    '𑐶','𑐷',
                    '𑐸','𑐹',
                    '𑐺','𑐻',
                    '𑐼','𑐽',
                    '','𑐾','𑐿',
                    '','𑑀','𑑁',
                ],
                other_marks: ['𑑄','𑑅','𑑃','𑑠','𑑡',''],
                virama: ['𑑂'],
                consonants: ['𑐎','𑐏','𑐐','𑐑','𑐒',
                    '𑐔','𑐕','𑐖','𑐗','𑐘',
                    '𑐚','𑐛','𑐜','𑐝','𑐞',
                    '𑐟','𑐠','𑐡','𑐢','𑐣',
                    '𑐥','𑐦','𑐧','𑐨','𑐩',
                    '𑐫','𑐬','𑐮','𑐰',
                    '𑐱','𑐲','𑐳','𑐴'
                ],
                symbols: ['𑑐','𑑑','𑑒','𑑓','𑑔','𑑕','𑑖','𑑗','𑑘','𑑙',
                '𑑉','','𑑇','𑑋','𑑌']
            },
            
            sarada: {
                vowels: ['𑆃','𑆄',
                    '𑆅','𑆆',
                    '𑆇','𑆈',
                    '𑆉','𑆊',
                    '𑆋','𑆌',
                    '','𑆍','𑆎',
                    '','𑆏','𑆐'
                ],
                vowel_marks: ['𑆳',
                    '𑆴','𑆵',
                    '𑆶','𑆷',
                    '𑆸','𑆹',
                    '𑆺','𑆻',
                    '','𑆼','𑆽',
                    '','𑆾','𑆿'
                ],
                other_marks: ['𑆁','𑆂','𑆀','𑇁','𑇂',''],
                virama: ['𑇀'],
                consonants: ['𑆑','𑆒','𑆓','𑆔','𑆕',
                    '𑆖','𑆗','𑆘','𑆙','𑆚',
                    '𑆛','𑆜','𑆝','𑆞','𑆟',
                    '𑆠','𑆡','𑆢','𑆣','𑆤',
                    '𑆥','𑆦','𑆧','𑆨','𑆩',
                    '𑆪','𑆫','𑆬','𑆮',
                    '𑆯','𑆰','𑆱','𑆲',
                    '𑆭'
                ],
                symbols: ['𑇐','𑇑','𑇒','𑇓','𑇔','𑇕','𑇖','𑇗','𑇘','𑇙',
                    '𑇄','','𑇁','𑇅','𑇆']
            },

            nandinagari: {
                vowels: ['\u{119A0}','\u{119A1}',
                    '\u{119A2}','\u{119A3}',
                    '\u{1194}','\u{119A5}',
                    '\u{119A6}','\u{119A7}',
                    '\u{119C9}\u{119D6}','\u{119C9}\u{119D7}',
                    '','\u{119AA}','\u{119AB}',
                    '','\u{119AC}','\u{119AD}'
                ],
                vowel_marks: ['\u{119D1}',
                    '\u{119D2}','\u{119D3}',
                    '\u{119D4}','\u{119D5}',
                    '\u{119D6}','\u{119D7}',
                    '\u{119C9}\u{119D6}','\u{119C9}\u{119D7}',
                    '','\u{119DA}','\u{119DB}',
                    '','\u{119DC}','\u{119DD}'
                ],
                other_marks: ['\u{119DE}','\u{119DF}','','',''],
                virama: ['\u{119E0}'],
                consonants: ['\u{119AE}','\u{119AF}','\u{119B0}','\u{119B1}','\u{11B2}',
                    '\u{119B3}','\u{119B4}','\u{119B5}','\u{119B6}','\u{119B7}',
                    '\u{119B8}','\u{119B9}','\u{119BA}','\u{119BB}','\u{119BC}',
                    '\u{119BD}','\u{119BE}','\u{119BF}','\u{119C0}','\u{119C1}',
                    '\u{119C2}','\u{119C3}','\u{119C4}','\u{119C5}','\u{119C6}',
                    '\u{119C7}','\u{119C8}','\u{119C9}','\u{119CA}',
                    '\u{119CB}','\u{119CC}','\u{119CD}','\u{119CE}',
                    '\u{119CF}','','\u{119D0}'
                ],
                // use Kannada numerals & Devanagari daṇḍas
                symbols: ['೦','೧','೨','೩','೪','೫','೬','೭','೮','೯',
                    '\u{119AC}\u{119DE}','','\u{119E1}','।','॥']
            },

            bengali: {
                vowels: ['অ','আ',
                'ই','ঈ',
                'উ','ঊ',
                'ঋ','ৠ',
                'ঌ','ৡ',
                '','এ','ঐ',
                '','ও','ঔ'],
                vowel_marks: ['া',
                'ি','ী',
                'ু','ূ',
                'ৃ','ৄ',
                'ৢ','ৣ',
                '','ে','ৈ',
                'ো','ৌ'],
                other_marks: ['ং','ঃ','ঁ','','',''],
                virama: ['্'],
                consonants: ['ক','খ','গ','ঘ','ঙ',
                'চ','ছ','জ','ঝ','ঞ',
                'ট','ঠ','ড','ঢ','ণ',
                'ত','থ','দ','ধ','ন',
                'প','ফ','ব','ভ','ম',
                'য','র','ল','ব',
                'শ','ষ','স','হ',
                'ळ','','','',
                'য়',
                '','','','','','','ড়','ঢ়' // (q qh ġ z zh f) ṙ ṙh (ṫh ḋh w)
                ],
                symbols: ['০','১','২','৩','৪','৫','৬','৭','৮','৯','ওঁ','','ঽ','।','॥'],
            },
            devanagari: {
                vowels: ['अ','आ', // a ā
                'इ','ई', // i ī
                'उ','ऊ', // u ū
                'ऋ','ॠ', // ṛ ṝ
                'ऌ','ॡ', // l̥ l̥̄
                'ऎ','ए','ऐ', // e ē ai
                'ऒ','ओ','औ' // o ō au
                ],
                vowel_marks: ['ा', // ā
                'ि','ी', // i ī
                'ु','ू', // u ū
                'ृ','ॄ', // ṛ ṝ
                'ॢ','ॣ', // l̥ l̥̄
                'ॆ','े','ै', // e ē ai
                'ॊ','ो','ौ', // o ō au
                'ॎ','ॎे','ॎा','ॎो' // e ai o au
                ],
                
                other_marks: ['ं','ः','ँ','ᳵ','ᳶ',''], // ṃ ḥ m̐ ẖ ḫ ḵ 

                virama: ['्'],

                consonants: ['क','ख','ग','घ','ङ',
                'च','छ','ज','झ','ञ',
                'ट','ठ','ड','ढ','ण',
                'त','थ','द','ध','न',
                'प','फ','ब','भ','म',     
                'य','र','ल','व',
                'श','ष','स','ह',
                'ळ','ऴ','ऱ','ऩ',
                'य़',
                'क़','ख़','ग़','ज़','झ़','फ़','ड़','ढ़','थ़','ध़','व़' // q qh ġ z zh f ṙ ṙh ṫh ḋh w
                ],

                symbols: ['०','१','२','३','४','५','६','७','८','९','ॐ','ꣽ','ऽ','।','॥'],

                zwj: ['\u200D'],

                // Dummy consonant. This is used in ITRANS to prevert certain types
                // of parser ambiguity. Thus "barau" -> बरौ but "bara_u" -> बरउ.
                skip: [''],

                // Vedic accent. Udatta and anudatta.
                accent: ['\u0951', '\u0952'],

                // Accent combined with anusvara and and visarga. For compatibility
                // with ITRANS, which allows the reverse of these four.
                combo_accent: 'ः॑ ः॒ ं॑ ं॒'.split(' '),
            },
            telugu: {
                vowels: ['అ','ఆ', // a ā
                'ఇ','ఈ', // i ī
                'ఉ','ఊ', // u ū
                'ఋ','ౠ', // ṛ ṝ
                'ఌ','ౡ', // l̥ l̥̄
                'ఎ','ఏ','ఐ', // e ē ai
                'ఒ','ఓ','ఔ' // o ō au
                ],
                vowel_marks: ['ా', // ā
                'ి','ీ', // i ī
                'ు','ూ', // u ū
                'ృ','ౄ', // ṛ r̄,
                'ౢ','ౣ', // l̥ l̥̄
                'ె','ే','ై', // e ē ai
                'ొ','ో','ౌ' // o ō au
                ],
                other_marks: ['ం','ః','ఀ','','',''], // ṃ ḥ m̐ ẖ ḫ ḵ (what about ardhānusvāra?)
                virama: ['్'],
                consonants: ['క','ఖ','గ','ఘ','ఙ', // k kh g gh ṅ
                'చ','ఛ','జ','ఝ','ఞ', // c ch j jh ñ
                'ట','ఠ','డ','ఢ','ణ', // ṭ ṭh ḍ ḍh ṇ
                'త','థ','ద','ధ','న', // t th d dh n
                'ప','ఫ','బ','భ','మ', // p ph b bh m
                'య','ర','ల','వ', // y r l v
                'శ','ష','స','హ', // ś ṣ s h
                'ళ','ఴ','ఱ'], // ḷ ḻ ṟ
                symbols: ['౦','౧','౨','౩','౪','౫','౬','౭','౮','౯','ఓం','','ఽ','।','॥'],
            },

            iast: {
                vowels: ['a','ā',
                'i','ī',
                'u','ū',
                'ṛ','ṝ',
                'l̥','l̥̄',
                'e','ē','ai',
                'o','ō','au',
                'ê','aî','ô','aû'], // Devanāgarī pṛṣthamātrās
                other_marks: ['ṃ','ḥ','m̐','ẖ','ḫ','ḵ'],
                virama: [''],
                consonants: ['k','kh','g','gh','ṅ',
                'c','ch','j','jh','ñ',
                'ṭ','ṭh','ḍ','ḍh','ṇ',
                't','th','d','dh','n',
                'p','ph','b','bh','m',
                'y','r','l','v',
                'ś','ṣ','s','h',
                'ḷ','ḻ','ṟ','ṉ', // Dravidian
                'ẏ', // Bengali
                'q','qh','ġ','z','zh','f','ṙ','ṙh','ṫh','ḋh','w'],
                symbols: ['0','1','2','3','4','5','6','7','8','9','oṁ','oḿ','\'','|','||','⁰','⁰⁰','⁰⁰⁰'],
            }
        },

        // Set of names of schemes
        romanSchemes = {},

        // Map of alternate encodings.
        allAlternates = {
        },

        // object cache
        cache = {};

    /**
     * Check whether the given scheme encodes romanized Sanskrit.
     *
     * @param name  the scheme name
     * @return      boolean
     */
    Sanscript.isRomanScheme = function(name) {
        return romanSchemes.hasOwnProperty(name);
    };

    /**
     * Add a Brahmic scheme to Sanscript.
     *
     * Schemes are of two types: "Brahmic" and "roman". Brahmic consonants
     * have an inherent vowel sound, but roman consonants do not. This is the
     * main difference between these two types of scheme.
     *
     * A scheme definition is an object ("{}") that maps a group name to a
     * list of characters. For illustration, see the "devanagari" scheme at
     * the top of this file.
     *
     * You can use whatever group names you like, but for the best results,
     * you should use the same group names that Sanscript does.
     *
     * @param name    the scheme name
     * @param scheme  the scheme data itself. This should be constructed as
     *                described above.
     */
    Sanscript.addBrahmicScheme = function(name, scheme) {
        Sanscript.schemes[name] = scheme;
    };

    /**
     * Add a roman scheme to Sanscript.
     *
     * See the comments on Sanscript.addBrahmicScheme. The "vowel_marks" field
     * can be omitted.
     *
     * @param name    the scheme name
     * @param scheme  the scheme data itself
     */
    Sanscript.addRomanScheme = function(name, scheme) {
        if (!('vowel_marks' in scheme)) {
            scheme.vowel_marks = scheme.vowels.slice(1);
        }
        Sanscript.schemes[name] = scheme;
        romanSchemes[name] = true;
    };

    /**
     * Create a deep copy of an object, for certain kinds of objects.
     *
     * @param scheme  the scheme to copy
     * @return        the copy
     */
    /*
    var cheapCopy = function(scheme) {
        var copy = {};
        for (var key in scheme) {
            if (!scheme.hasOwnProperty(key)) {
                continue;
            }
            copy[key] = scheme[key].slice(0);
        }
        return copy;
    };
    */
    // Set up various schemes
    (function() {
        // Set up roman schemes
        /*
        var kolkata = schemes.kolkata = cheapCopy(schemes.iast),
            schemeNames = 'iast itrans hk kolkata slp1 velthuis wx'.split(' ');
        kolkata.vowels = 'a ā i ī u ū ṛ ṝ ḷ ḹ e ē ai o ō au'.split(' ');
        */
        var schemeNames = ['iast'];
        // These schemes already belong to Sanscript.schemes. But by adding
        // them again with `addRomanScheme`, we automatically build up
        // `romanSchemes` and define a `vowel_marks` field for each one.
        for (var i = 0, name; (name = schemeNames[i]); i++) {
            Sanscript.addRomanScheme(name, schemes[name]);
        }
        /*
        // ITRANS variant, which supports Dravidian short 'e' and 'o'.
        var itrans_dravidian = cheapCopy(schemes.itrans);
        itrans_dravidian.vowels = 'a A i I u U Ri RRI LLi LLi e E ai o O au'.split(' ');
        itrans_dravidian.vowel_marks = itrans_dravidian.vowels.slice(1);
        allAlternates.itrans_dravidian = allAlternates.itrans;
        Sanscript.addRomanScheme('itrans_dravidian', itrans_dravidian);
    */
    }());

    /**
     * Create a map from every character in `from` to its partner in `to`.
     * Also, store any "marks" that `from` might have.
     *
     * @param from     input scheme
     * @param to       output scheme
     * @param options  scheme options
     */
    var makeMap = function(from, to, /*options*/) {
        var alternates = allAlternates[from] || {},
            consonants = {},
            fromScheme = Sanscript.schemes[from],
            letters = {},
            tokenLengths = [],
            marks = {},
            toScheme = Sanscript.schemes[to];

        for (var group in fromScheme) {
            if (!fromScheme.hasOwnProperty(group)) {
                continue;
            }
            var fromGroup = fromScheme[group],
                toGroup = toScheme[group];
            if (toGroup === undefined) {
                continue;
            }
            for (var i = 0; i < fromGroup.length; i++) {
                var F = fromGroup[i],
                    T = toGroup[i],
                    alts = alternates[F] || [],
                    numAlts = alts.length,
                    j = 0;

                tokenLengths.push(F.length);
                for (j = 0; j < numAlts; j++) {
                    tokenLengths.push(alts[j].length);
                }

                if (group === 'vowel_marks' || group === 'virama') {
                    marks[F] = T;
                    for (j = 0; j < numAlts; j++) {
                        marks[alts[j]] = T;
                    }
                } else {
                    letters[F] = T;
                    for (j = 0; j < numAlts; j++) {
                        letters[alts[j]] = T;
                    }
                    if (group === 'consonants' || group === 'other') {
                        consonants[F] = T;

                        for (j = 0; j < numAlts; j++) {
                            consonants[alts[j]] = T;
                        }
                    }
                }
            }
        }
        return {consonants: consonants,
            fromRoman: Sanscript.isRomanScheme(from),
            letters: letters,
            marks: marks,
            maxTokenLength: Math.max.apply(Math, tokenLengths),
            toRoman: Sanscript.isRomanScheme(to),
            virama: toScheme.virama};
    };

    /**
     * Transliterate from a romanized script.
     *
     * @param data     the string to transliterate
     * @param map      map data generated from makeMap()
     * @param options  transliteration options
     * @return         the finished string
     */
    var transliterateRoman = function(data, map, options) {
        var buf = [],
            consonants = map.consonants,
            dataLength = data.length,
            hadConsonant = false,
            letters = map.letters,
            marks = map.marks,
            maxTokenLength = map.maxTokenLength,
            optSkipSGML = options.skip_sgml,
            optSyncope = options.syncope,
            tempLetter,
            tempMark,
            tokenBuffer = '',
            toRoman = map.toRoman,
            virama = map.virama;

        // Transliteration state. It's controlled by these values:
        // - `skippingSGML`: are we in SGML?
        // - `toggledTrans`: are we in a toggled region?
        //
        // We combine these values into a single variable `skippingTrans`:
        //
        //     `skippingTrans` = skippingSGML || toggledTrans;
        //
        // If (and only if) this value is true, don't transliterate.
        var skippingSGML = false,
            skippingTrans = false,
            toggledTrans = false;

        for (var i = 0, L; (L = data.charAt(i)) || tokenBuffer; i++) {
            // Fill the token buffer, if possible.
            var difference = maxTokenLength - tokenBuffer.length;
            if (difference > 0 && i < dataLength) {
                tokenBuffer += L;
                if (difference > 1) {
                    continue;
                }
            }

            // Match all token substrings to our map.
            for (var j = 0; j < maxTokenLength; j++) {
                var token = tokenBuffer.substr(0,maxTokenLength-j);

                if (skippingSGML === true) {
                    skippingSGML = (token !== '>');
                } else if (token === '<') {
                    skippingSGML = optSkipSGML;
                } else if (token === '##') {
                    toggledTrans = !toggledTrans;
                    tokenBuffer = tokenBuffer.substr(2);
                    break;
                }
                skippingTrans = skippingSGML || toggledTrans;
                if ((tempLetter = letters[token]) !== undefined && !skippingTrans) {
                    if (toRoman) {
                        buf.push(tempLetter);
                    } else {
                        // Handle the implicit vowel. Ignore 'a' and force
                        // vowels to appear as marks if we've just seen a
                        // consonant.
                        if (hadConsonant) {
                            if ((tempMark = marks[token])) {
                                buf.push(tempMark);
                            } else if (token !== 'a') {
                                buf.push(virama);
                                buf.push(tempLetter);
                            }
                        } else {
                            buf.push(tempLetter);
                        }
                        hadConsonant = token in consonants;
                    }
                    tokenBuffer = tokenBuffer.substr(maxTokenLength-j);
                    break;
                } else if (j === maxTokenLength - 1) {
                    if (hadConsonant) {
                        hadConsonant = false;
                        if (!optSyncope) {
                            buf.push(virama);
                        }
                    }
                    buf.push(token);
                    tokenBuffer = tokenBuffer.substr(1);
                    // 'break' is redundant here, "j == ..." is true only on
                    // the last iteration.
                }
            }
        }
        if (hadConsonant && !optSyncope) {
            buf.push(virama);
        }
        return buf.join('');
    };

    /**
     * Transliterate from a Brahmic script.
     *
     * @param data     the string to transliterate
     * @param map      map data generated from makeMap()
     * @param options  transliteration options
     * @return         the finished string
     */
    var transliterateBrahmic = function(data, map, /*options*/) {
        var buf = [],
            consonants = map.consonants,
            hadRomanConsonant = false,
            letters = map.letters,
            marks = map.marks,
            dataLength = data.length,
            maxTokenLength = map.maxTokenLength,
            tempLetter,
            tokenBuffer = '',
            toRoman = map.toRoman,
            skippingTrans = false;

        for (var i = 0, L; (L = data.charAt(i)) || tokenBuffer; i++) {
            // Fill the token buffer, if possible.
            var difference = maxTokenLength - tokenBuffer.length;
            if (difference > 0 && i < dataLength) {
                tokenBuffer += L;
                if (difference > 1) {
                    continue;
                }
            }

            // Match all token substrings to our map.
            for (var j = 0; j < maxTokenLength; j++) {
                var token = tokenBuffer.substr(0,maxTokenLength-j);

                if((tempLetter = marks[token]) !== undefined && !skippingTrans) {
                    buf.push(tempLetter);
                    hadRomanConsonant = false;
                    tokenBuffer = tokenBuffer.substr(maxTokenLength-j);
                    break;
                } 
                else if((tempLetter = letters[token])) {
                    if (hadRomanConsonant) {
                        buf.push('a');
                        hadRomanConsonant = false;
                    }
                    buf.push(tempLetter);
                    hadRomanConsonant = toRoman && (token in consonants);
                    tokenBuffer = tokenBuffer.substr(maxTokenLength-j);
                    break;

                } else if (j === maxTokenLength - 1) {
                    if (hadRomanConsonant) {
                        buf.push('a');
                        hadRomanConsonant = false;
                    }
                    buf.push(token);
                    tokenBuffer = tokenBuffer.substr(1);
                }
            }
        }
        if (hadRomanConsonant) {
            buf.push('a');
        }
        return buf.join('');
    };

    /**
     * Transliterate from one script to another.
     *
     * @param data     the string to transliterate
     * @param from     the source script
     * @param to       the destination script
     * @param options  transliteration options
     * @return         the finished string
     */
    Sanscript.t = function(data, from, to, options) {
        options = options || {};
        var cachedOptions = cache.options || {},
            defaults = Sanscript.defaults,
            hasPriorState = (cache.from === from && cache.to === to),
            map;

        // Here we simultaneously build up an `options` object and compare
        // these options to the options from the last run.
        for (var key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                var value = defaults[key];
                if (key in options) {
                    value = options[key];
                }
                options[key] = value;

                // This comparison method is not generalizable, but since these
                // objects are associative arrays with identical keys and with
                // values of known type, it works fine here.
                if (value !== cachedOptions[key]) {
                    hasPriorState = false;
                }
            }
        }

        if (hasPriorState) {
            map = cache.map;
        } else {
            map = makeMap(from, to);
            cache = {
                from: from,
                map: map,
                options: options,
                to: to};
        }
        /*
        // Easy way out for "{\m+}", "\", and ".h".
        if (from === 'itrans') {
            data = data.replace(/\{\\m\+\}/g, '.h.N');
            data = data.replace(/\.h/g, '');
            data = data.replace(/\\([^'`_]|$)/g, '##$1##');
        }
        */
        if (map.fromRoman) {
            return transliterateRoman(data, map, options);
        } else {
            return transliterateBrahmic(data, map);
        }
    };

    const viewPos = (function() {

        const set = function(par,middle) {
            if(!middle) return;
            const scrollpos = par.scrollTop + middle[0].getBoundingClientRect().top + middle[1] - window.innerHeight/2;
            par.scrollTo(0,scrollpos);
        };

        const get = function(par) {
            const els = par.querySelectorAll('div');
            //const els = par.querySelectorAll('#summary,tr,span.milestone,span.lb,span.locus');
            var midEl = null;
            var lastDist;
            var currDist = null;
            const ellen = els.length;
            for(let i=0;i<ellen;i++) {
                lastDist = currDist;
                currDist = window.innerHeight/2 - els[i].getBoundingClientRect().top;
                if(lastDist !== null && Math.abs(currDist) > Math.abs(lastDist)) {
                    midEl = els[i-1];
                    currDist = lastDist;
                    break;
                }
            }
            if(midEl === null)
                midEl = els[ellen-1];
            return [midEl,currDist];
        };

        return Object.freeze({
            getVP: get,
            setVP: set
        });

    }());

    function h(B){var A=[],t=0;if(this.trie=this.createTrie(B.patterns),this.leftMin=B.leftmin,this.rightMin=B.rightmin,this.exceptions={},B.exceptions)for(A=B.exceptions.split(/,\s?/g);t<A.length;t+=1)this.exceptions[A[t].replace(/\u2027/g,"").toLowerCase()]=new RegExp("("+A[t].split("‧").join(")(")+")","i");}h.prototype.createTrie=function(B){var A=0,t=0,e=0,u=0,n=null,i=null,F=null,C=null,r={_points:[]},s;for(A in B)if(B.hasOwnProperty(A))for(s=B[A].match(new RegExp(".{1,"+ +A+"}","g")),t=0;t<s.length;t+=1){for(n=s[t].replace(/[0-9]/g,"").split(""),i=s[t].split(/\D/),C=r,e=0;e<n.length;e+=1)F=n[e].charCodeAt(0),C[F]||(C[F]={}),C=C[F];for(C._points=[],u=0;u<i.length;u+=1)C._points[u]=i[u]||0;}return r},h.prototype.hyphenateText=function(B,A){A=A||4;for(var t=B.split(/([a-zA-Z0-9_\u0027\u00AD\u00DF-\u00EA\u00EB\u00EC-\u00EF\u00F1-\u00F6\u00F8-\u00FD\u0101\u0103\u0105\u0107\u0109\u010D\u010F\u0111\u0113\u0117\u0119\u011B\u011D\u011F\u0123\u0125\u012B\u012F\u0131\u0135\u0137\u013C\u013E\u0142\u0144\u0146\u0148\u0151\u0153\u0155\u0159\u015B\u015D\u015F\u0161\u0165\u016B\u016D\u016F\u0171\u0173\u017A\u017C\u017E\u017F\u0219\u021B\u02BC\u0390\u03AC-\u03CE\u03F2\u0401\u0410-\u044F\u0451\u0454\u0456\u0457\u045E\u0491\u0531-\u0556\u0561-\u0587\u0902\u0903\u0905-\u090B\u090E-\u0910\u0912\u0914-\u0928\u092A-\u0939\u093E-\u0943\u0946-\u0948\u094A-\u094D\u0982\u0983\u0985-\u098B\u098F\u0990\u0994-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BE-\u09C3\u09C7\u09C8\u09CB-\u09CD\u09D7\u0A02\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A14-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A82\u0A83\u0A85-\u0A8B\u0A8F\u0A90\u0A94-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABE-\u0AC3\u0AC7\u0AC8\u0ACB-\u0ACD\u0B02\u0B03\u0B05-\u0B0B\u0B0F\u0B10\u0B14-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3E-\u0B43\u0B47\u0B48\u0B4B-\u0B4D\u0B57\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C02\u0C03\u0C05-\u0C0B\u0C0E-\u0C10\u0C12\u0C14-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3E-\u0C43\u0C46-\u0C48\u0C4A-\u0C4D\u0C82\u0C83\u0C85-\u0C8B\u0C8E-\u0C90\u0C92\u0C94-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBE-\u0CC3\u0CC6-\u0CC8\u0CCA-\u0CCD\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60\u0D61\u0D7A-\u0D7F\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB2-\u1FB4\u1FB6\u1FB7\u1FBD\u1FBF\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD2\u1FD3\u1FD6\u1FD7\u1FE2-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u200D\u2019]+)/gi),e=0;e<t.length;e+=1)t[e].indexOf("/")!==-1?e!==0&&e!==t.length-1&&!/\s+\/|\/\s+/.test(t[e])&&(t[e]+="​"):t[e].length>A&&(t[e]=this.hyphenate(t[e]).join("­"));return t.join("")},h.prototype.hyphenate=function(B){var A,t=[],e,u,n,i,F,C=[],r,s=B.toLowerCase(),o,p,l=Math.max,f=this.trie,D=[""];if(this.exceptions.hasOwnProperty(s))return B.match(this.exceptions[s]).slice(1);if(B.indexOf("­")!==-1)return [B];for(B="_"+B+"_",A=B.toLowerCase().split(""),e=B.split(""),r=A.length,u=0;u<r;u+=1)C[u]=0,t[u]=A[u].charCodeAt(0);for(u=0;u<r;u+=1)for(F=f,n=u;n<r&&(F=F[t[n]],F);n+=1)if(o=F._points,o)for(i=0,p=o.length;i<p;i+=1)C[u+i]=l(C[u+i],o[i]);for(u=1;u<r-1;u+=1)u>this.leftMin&&u<r-this.rightMin&&C[u]%2?D.push(e[u]):D[D.length-1]+=e[u];return D};var a=h;

    const hyphenation_ta = {
        id: 'ta',
        leftmin: 2,
        rightmin: 2,
        patterns: {
            2: "ா1ி1ீ1ு1ூ1ெ1ே1ை1ொ1ோ1ௌ11க1ங1ச1ஜ1ஞ1ட1ண1த1ந1ப1ம1ய1ர1ற1ல1ள1ழ1வ1ஷ1ஸ1ஹ",
            3: "1அ11ஆ11இ11ஈ11உ11ஊ11எ11ஏ11ஐ11ஒ11ஓ11ஔ12ஂ12ஃ12ௗ12்1",
            4: "2க்12ங்12ச்12ஞ்12ட்12ண்12த்12ன்12ந்12ப்12ம்12ய்12ர்12ற்12ல்12ள்12ழ்12வ்12ஷ்12ஸ்12ஹ்1"
        },
    };

    const hyphenation_ta_Latn = {
        id : 'ta-Latn',
        leftmin : 2,
        rightmin : 2,
        patterns : {
            2 : "a1e1i1o1u1ē1í1ï1ō1ú1ü1ā1ī1ū1",
            3 : "2b_2c_2d_2g_2h_2j_2k_2l_2m_2n_2p_2r_2s_2t_2v_2y_2ñ_2ś_2ḍ_2ḥ12ḫ12ṁ12ṃ12ṅ_2ṇ_2ṭ_2ẖ1l̥1r̥1",
            4 : "2bh_2ch_2dh_2gh_2jh_2kh_2m̐12ph_2rb_2rd_2rg_2rk_2rp_2rt_2rḍ_2rṭ_2th_2ḍh_2ṭh_a2i1a2u1a3ï1a3ü1l̥̄1r̥̄1"
        },
    };

    const hyphenation_sa = {
        id : 'sa',
        leftmin : 2,
        rightmin : 2,
        patterns : {
            2 : "a1e1i1o1u1é1í1ï1ó1ú1ü1ā1ī1ū1ḷ1ḹ1ṛ1ṝ1",
            3 : "2b_2c_2d_2g_2h_2j_2k_2l_2m_2n_2p_2r_2s_2t_2v_2y_2ñ_2ś_2ḍ_2ḥ12ḫ12ḷ_2ṁ12ṃ12ṅ_2ṇ_2ṭ_2ẖ1l̥1r̥1",
            4 : "2bh_2ch_2dh_2gh_2jh_2kh_2m̐12ph_2rb_2rd_2rg_2rk_2rp_2rt_2rḍ_2rṭ_2th_2ḍh_2ṭh_a2i1a2u1a3ï1a3ü1l̥̄1r̥̄1"
        },
    };

    // For questions about the Hindi hyphenation patterns
    // ask Santhosh Thottingal (santhosh dot thottingal at gmail dot com)
    const hyphenation_hi = {
    	id: 'hi',
    	leftmin: 2,
    	rightmin: 2,
    	specialChars : unescape("आअइईउऊऋऎएऐऒऔकगखघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळऴऱिीाुूृॆेॊाोैौ्ःं%u200D"),
    	patterns: {
    		2 : "अ1आ1इ1ई1उ1ऊ1ऋ1ऎ1ए1ऐ1ऒ1औ1ि1ा1ी1ु1ू1ृ1ॆ1े1ॊ1ो1ौ1्2ः1ं11क1ग1ख1घ1ङ1च1छ1ज1झ1ञ1ट1ठ1ड1ढ1ण1त1थ1द1ध1न1प1फ1ब1भ1म1य1र1ल1व1श1ष1स1ह1ळ1ऴ1ऱ"
    	}
    };

    const Transliterate$1 = (function() {
        const _state = Object.seal({
            hindic: Object.freeze(['mr','hi','gu','raj','bra']),
            scriptToIso: new Map([
                ['tamil','Taml'],
                ['bengali','Beng'],
                ['devanagari','Deva'],
                ['grantha','Gran'],
                ['malayalam','Mlym'],
                ['newa','Newa'],
                ['sarada','Shrd'],
                ['telugu','Telu'],
                ['nandinagari','Nand']
            ]),
            cachedtext: new Map(),
            parEl: null,
            hyphenator: {
                'ta-Taml': new a(hyphenation_ta),
                'sa-Latn': new a(hyphenation_sa),
                'ta-Latn': new a(hyphenation_ta_Latn),
                'te-Latn': new a(hyphenation_sa),
                'hi-Deva': new a(hyphenation_hi)
            },
            defaultSanscript: null,
            reverselangs: new Map([
                ['ta-Latn-t-ta-Taml','ta-Taml-t-ta-Latn'],
                ['ta-Taml-t-ta-Latn','ta-Latn-t-ta-Taml'],
                ['te-Latn-t-te-Gran','te-Gran-t-te-Latn'],
                ['te-Gran-t-te-Latn','te-Latn-t-te-Gran'],
                /*
                ['mr-Latn-t-mr-Deva','mr-Deva-t-mr-Latn'],
                ['mr-Deva-t-mr-Latn','mr-Latn-t-mr-Deva'],
                ['hi-Latn-t-hi-Deva','hi-Deva-t-hi-Latn'],
                ['hi-Deva-t-hi-Latn','hi-Latn-t-hi-Deva']
                */
            ]),
            isoToScript: new Map(),
            availlangs: null,
            scriptnames: null,
            isonames: null,
            button: null
        });
        
        _state.availlangs = Object.freeze(['sa','ta','te',..._state.hindic]);

        _state.hindic.forEach(code => {
            _state.hyphenator[`${code}-Latn`] = _state.hyphenator['sa-Latn'];
            if(code !== 'hi')
                _state.hyphenator[`${code}-Deva`] = _state.hyphenator['hi-Deva'];
            _state.reverselangs.set(`${code}-Latn-t-${code}-Deva`,`${code}-Deva-t-${code}-Latn`);
            _state.reverselangs.set(`${code}-Deva-t-${code}-Latn`,`${code}-Latn-t-${code}-Deva`);
        });
        /*
        _state.hyphenator['mr-Latn'] = _state.hyphenator['sa-Latn'];
        _state.hyphenator['mr-Deva'] = _state.hyphenator['hi-Deva'];
        _state.hyphenator['hi-Latn'] = _state.hyphenator['sa-Latn'];
        */

        _state.scriptToIso.forEach((val,key) => _state.isoToScript.set(val,key));

        _state.scriptnames = new Set(_state.scriptToIso.keys());

        _state.isonames = new Set(_state.scriptToIso.values());
        for(const val of _state.isonames) {
            if(val === 'tamil') continue;
            _state.reverselangs.set(`sa-${val}-t-sa-Latn`,`sa-Latn-t-sa-${val}`);
            _state.reverselangs.set(`sa-Latn-t-sa-${val}`,`sa-${val}-t-sa-Latn`);
        }

        const events = {
            transClick(e) {
                const vpos = viewPos.getVP(_state.parEl);
                transliterator.toggle();
                viewPos.setVP(_state.parEl,vpos);
            },
        };

        const init = (par = document.body) => {

            // reset state
            _state.parEl = par; 
            if(!_state.parEl.lang) _state.parEl.lang = 'en';

            // find if there are any Tamil or Sanskrit passages
            const foundTamil = par.querySelector('[lang|="ta"]');
            const foundSanskrit = par.querySelector('[lang|="sa"]');
            if(!foundTamil && !foundSanskrit) return;

            if(foundSanskrit) {
                const scripttags = par.getElementsByClassName('record_scripts');
                const defaultSanscript = getSanscript(scripttags);
                if(!defaultSanscript && !foundTamil) {
                    // hyphenate text even if no transliteration available
                    const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
                    prepTextWalker(walker);
                    return;
                }
                else _state.defaultSanscript = defaultSanscript;
            }
          
            // prepare the text for transliteration
            prepText();

            // initialize button
            _state.button = document.getElementById('transbutton');
            button.init(foundTamil);
        };

        const button = {
            init(tamil) {
                if(tamil) {
                    _state.button.textContent = to.tamil('a');
                    _state.button.lang = 'ta-Taml';
                }
                else {
                    _state.button.textContent = to[_state.defaultSanscript]('a');
                    _state.button.lang = `sa-${_state.scriptToIso.get(_state.defaultSanscript)}`;
                }
                _state.button.addEventListener('click',events.transClick);
                _state.button.style.display = 'block';
            },
            revert() {
                _state.button.textContent = _state.button.dataset.oldcontent;
                _state.button.lang = _state.button.dataset.oldlang;
            },
            transliterate() {
                _state.button.dataset.oldcontent = _state.button.textContent;
                _state.button.dataset.oldlang = _state.button.lang;
                _state.button.textContent = 'A';
                _state.button.lang = 'en';
            },
        };

        const cache = {
            /** Caches the text of a text node, after having applied some transformations:
             *      1. Add appropriate non-breaking spaces,
             *      2. Hyphenate the text
             *      3. Transliterate the text if not in Latin script
             *  @param  {Node}   txtnode
             *  @return {String}         Hyphenated (and transliterated) text
             */
            set(txtnode) {
                // don't break before daṇḍa, or between daṇḍa and numeral/puṣpikā
                const nbsp = String.fromCodePoint('0x0A0');
                const txt = txtnode.data
                    .replace(/\s+([\|।॥])/g,`${nbsp}$1`)
                    .replace(/([\|।॥])\s+(?=[\d०१२३४५६७८९❈꣸৽৽])/g,`$1${nbsp}`);
                
                const getShortLang = (node) => {
                    const s = node.lang.split('-t-');
                    if(node.classList.contains('originalscript'))
                        return s[1];
                    else
                        return s[0];
                };
                // hyphenate according to script (Tamil or Romanized)
                const shortlang = getShortLang(txtnode.parentNode);
                if(_state.hyphenator.hasOwnProperty(shortlang)) {
                    const hyphenated = _state.hyphenator[shortlang].hyphenateText(txt);
                    _state.cachedtext.set(txtnode,hyphenated);
                    // convert Tamil (and others) to Roman
                    if(shortlang === 'ta-Taml') {
                        return to.iast(hyphenated);
                    }
                    //else if(shortlang === 'hi-Deva' || shortlang === 'mr-Deva') {
                    else if(shortlang.split('-')[1] === 'Deva') {
                        // TODO: also deal with 'sa-Beng', 'sa-Shar', etc.
                        return to.iast(hyphenated,'devanagari');
                    }
                    else return hyphenated;
                }
                else {
                    _state.cachedtext.set(txtnode,txt);
                    return txt;
                }
            },
            
            /** Retrieves cached text, based on the supplied node.
             *  @param {Node} txtnode
             *  @return       string
             */
            get: (txtnode) => _state.cachedtext.has(txtnode) ?
                                   _state.cachedtext.get(txtnode) :
                                   txtnode.data,
        };
       
        const getSanscript = (handDescs) => {
            if(handDescs.length === 0) return _state.defaultSanscript;
        
            // just take first script, or Tamil (Grantha) if necessary
            let maybetamil = false;
            for(const handDesc of handDescs) {
                const scripts = handDesc.dataset.script.split(' ');
                for(const script of scripts) {
                    if(script === 'tamil') maybetamil = true;
                    else if(_state.scriptnames.has(script)) return script;
                }
            }
            return maybetamil ? 'grantha' : false;
            /*
            const scripts = [...handDescs].reduce((acc,cur) => {
                for(const s of cur.dataset.script.split(' '))
                    acc.add(s);
                    return acc;
            },new Set());
            
            let maybetamil = false;
            for(const s of scripts) {
                if(s === 'tamil') maybetamil = true;
                else if(_state.scriptnames.has(s)) return s;
            }
            return maybetamil ? 'grantha' : false;
            */
        };
        const prepText = () => {
            // tag codicological units associated with a script first
            const synchs = _state.parEl.querySelectorAll('[data-synch]');
            for(const synch of synchs) {
                synch.lang = synch.lang ? synch.lang : 'en';
                const units = synch.dataset.synch.split(' ');
                // decide on a script for Sanskrit
                const scriptcode = (() => {
                    // if this is a handDesc element
                    if(synch.classList.contains('record_scripts'))
                        return _state.scriptToIso.get(getSanscript([synch]));
                    // otherwise
                    const unitselector = units.map(s => `[data-synch~='${s}']`);
                    const handDescs = [..._state.parEl.getElementsByClassName('record_scripts')].filter(el => el.matches(unitselector));
                    const script = getSanscript(handDescs) || _state.defaultSanscript;
                    return _state.scriptToIso.get(script);
                })();
                
                const walker = document.createTreeWalker(synch,NodeFilter.SHOW_ALL);
                prepTextWalker(walker,scriptcode);
            }

            // tag rest of the document; use default script for Sanskrit
            const isodefault = _state.scriptToIso.get(_state.defaultSanscript);
            const walker = document.createTreeWalker(_state.parEl,NodeFilter.SHOW_ALL, 
                { acceptNode(node) { return node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-synch') ?
                    NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT} });
            prepTextWalker(walker,isodefault);
        };
        
        /**
         * Prepares the text for transliteration:
         * 1. Tags every element with a lang attribute, 
         * 2. Caches Sanskrit and Tamil text nodes,
         *   a. Hyphenates text,
         *   b. Transliterates ta-Taml text into Latin script.
         *   @param {TreeWalker} walker
         *   @param {String}     scriptcode Sanskrit script in use, e.g. Beng, Deva, etc. If undefined, the default 'sa-Latn' tag is used.
         */
        const prepTextWalker = (walker,scriptcode) => {
            let curnode = walker.currentNode;
            while(curnode) {
                if(curnode.nodeType === Node.ELEMENT_NODE) {
                    // what about script features? (e.g. valapalagilaka)
                    const curlangattr = curnode.lang;
                    if(!curlangattr) {
                        // lang undefined; copy from parent
                        curnode.lang = curnode.parentNode.lang;
                        if(curnode.parentNode.classList.contains('originalscript'))
                            curnode.classList.add('originalscript');
                    }
                    else {
                        const [curlang,curscript] = curlangattr.split('-');
                        if(curlang === 'ta') {
                            if(!curscript) {
                                // assume Madras Lexicon transliteration
                                curnode.lang = 'ta-Latn-t-ta-Taml';
                            }
                            // Tamil in Tamil script
                            else if(curscript === 'Taml') {
                                curnode.classList.add('originalscript');
                                curnode.lang = 'ta-Latn-t-ta-Taml';
                            }
                            // Tamil in other scripts?
                        }

                        else if(curlang === 'sa' || _state.hindic.indexOf(curlang) !== -1) {
                            // case 1: sa-XXXX
                            // case 2: sa
                            // case 3: sa-Latn[-t-sa-XXXX]
                            if(curscript && curscript !== 'Latn') {
                                // Sanskrit(/Hindi/Marathi/etc.) written in a specific script
                                curnode.lang = `${curlang}-Latn-t-${curlang}-${curscript}`;
                                curnode.classList.add('originalscript');
                            }
                            else if(curlangattr === curlang) {
                                // no script specified, assume IAST transliteration
                                // case 1: script is specified by parent or parameter
                                    // could be a 'hi-Deva' parent, with 'sa' child === 'sa-Deva'
                                const parscript = (() => {
                                    const scriptsplit = curnode.parentNode.lang.split('-');
                                    if(scriptsplit.length > 1)
                                        return scriptsplit.pop();
                                    else return null;
                                })();
                                let scriptappend = parscript || scriptcode;

                                // if language is unqualified 'sa' and script is 'Taml', 
                                // switch to 'Gran'
                                if(curlang === 'sa' && scriptappend && scriptappend.endsWith('Taml'))
                                    scriptappend = 'Gran';

                                curnode.lang = scriptappend ? 
                                    `${curlang}-Latn-t-${curlang}-${scriptappend}`:
                                // case 2: script not specified at all
                                    `${curlang}-Latn`;
                                /*
                                const parlength = parlang.length;
                                if(parlength > 0 && parlang[parlength-1] !== 'Taml') {
                                    curnode.lang = parlangcode + curnode.parentNode.lang;
                                }
                                else {
                                    const sascriptcode = scriptcode === 'Taml' ? 
                                        'Gran' : scriptcode; 
                                    curnode.lang = sascriptcode ? 
                                        `${curlang}-Latn-t-${curlang}-${sascriptcode}` : 'sa-Latn';
                                
                                }
                                */
                            }
                            // case 3: no change
                        }
                        // unknown language (not ta, sa, hi, mr, etc.)
                    }
                }
                else if(curnode.nodeType === Node.TEXT_NODE) {
                    const curlang = curnode.parentNode.lang.split('-')[0];
                    if(_state.availlangs.includes(curlang)) {
                        curnode.data = cache.set(curnode);
                    }
                }
                curnode = walker.nextNode();
            }
        };

        const transliterator = {
            toggle() {
                const subst = _state.parEl.querySelectorAll('span.subst, span.choice, span.expan');
                //const subst = document.querySelectorAll(`span.subst[lang|="${tolang.lang}"],span.choice[lang|="${tolang.lang}"],span.expan[lang|="${tolang.lang}"`);
                if(_state.button.lang === 'en') {
                    this.revert();
                    for(const s of subst)
                        this.unjiggle(s);
                    button.revert();
                }
                else {
                    for(const s of subst)
                        if(s.lang.startsWith('sa') || s.lang.startsWith('ta')) this.jiggle(s);
                    this.convertNums();
                    this.activate();
                    button.transliterate();
                }
            },
            
            revert(par = _state.parEl) {
                const puncs = par.getElementsByClassName('invisible');
                for(const p of puncs) p.classList.remove('off');
                 
                const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
                var curnode = walker.currentNode;
                while(curnode) {
                    if(curnode.nodeType === Node.ELEMENT_NODE) {
                        const rev = _state.reverselangs.get(curnode.lang);
                        if(rev) curnode.lang = rev;
                    }
                    else if(curnode.nodeType === Node.TEXT_NODE) {
                        // lang attribute has already been reversed (hence take index 1)
                        const parlang = curnode.parentNode.lang.split('-');
                        const fromLatn = parlang[1];
                        if(fromLatn === 'Latn') {
                            const result = (() => {
                                const cached = cache.get(curnode);
                                if(curnode.parentNode.classList.contains('originalscript')) {
                                    //TODO: also do for sa-Beng, sa-Deva, etc.
                                    const fromcode = _state.isoToScript.get(parlang[4]);
                                    return to.iast(cached,fromcode);
                                }
                                else
                                    return cached;
                            })();
                            if(result !== undefined) curnode.data = result;
                        }
                    }
                    curnode = walker.nextNode();
                }
            },
            
            convertNums() {
                const nums = _state.parEl.querySelectorAll('span.num.trad[lang="ta-Latn-t-ta-Taml"], span.num.trad[lang="sa-Latn-t-sa-Gran"], span.num.trad[lang="sa-Latn-t-sa-Mlym"]');
                for(const num of nums) {
                    const walker = document.createTreeWalker(num,NodeFilter.SHOW_TEXT,
                        {acceptNode() {return NodeFilter.FILTER_ACCEPT;} });
                    walker.currentNode;
                    while(walker.nextNode()) {
                        const curnode = walker.currentNode;
                        curnode.data = to.nums(curnode.data);
                    }
                }
            },

            activate(par = _state.parEl) {
                // Go through all <pc>-</pc> tags and make them invisible,
                // then empty the text node on the left, and add its content
                // to the text not on the right.
                // If there are many <pc> tags, the text node on the right
                // just keeps getting longer.
                // The original state of each text node was previously cached.
                const puncs = par.getElementsByClassName('invisible');
                //const puncs = _state.parEl.querySelectorAll(`.invisible[lang=${langcode}]`);
                for(const p of puncs) {
                    if(p.lang === 'en') continue; // en nodes aren't cached
                    //if(p.classList.contains('off')) continue;
                    p.classList.add('off');
                    const prev = p.previousSibling;
                    const next = p.nextSibling;
                    if(prev && (prev.nodeType === Node.TEXT_NODE) &&
                       next && (next.nodeType === Node.TEXT_NODE)) {
                        next.data = prev.data + next.data;
                        prev.data = '';
                    }
                    else if(prev && prev.nodeType === 1 && prev.classList.contains('temporary') &&
                        next && next.nodeType === 1 && next.classList.contains('temporary')) {
                        next.firstChild.data = prev.firstChild.data + next.firstChild.data;
                        prev.firstChild.data = '';
                    }
                }
                 
                const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
                var curnode = walker.currentNode;
                while(curnode) {
                    if(curnode.nodeType === Node.ELEMENT_NODE) {
                        const rev = _state.reverselangs.get(curnode.lang);
                        if(rev) curnode.lang = rev;
                    }
                    else if(curnode.nodeType === Node.TEXT_NODE) {
                        const [lang, script] = (() => {
                            const s = curnode.parentNode.lang.split('-');
                            return [s[0],s[1]];
                        })();
                        if(_state.availlangs.includes(lang)) {
                            const scriptfunc = (() => {
                                if(to.hasOwnProperty(script))
                                    return to[script];
                                return null;
                            })();
                            const result = (() => {
                                if(curnode.parentElement.dataset.hasOwnProperty('glyph'))
                                    return curnode.parentElement.dataset.glyph;
                                if(curnode.parentElement.classList.contains('originalscript'))
                                    return cache.get(curnode);
                                if(!scriptfunc) return undefined;
                                return scriptfunc(curnode.data);
                            })();
                            if(result !== undefined) curnode.data = result;
                        }
                    }
                    curnode = walker.nextNode();
                }
            },
            jiggle(node/*,script,lang*/) {
                if(node.firstChild.nodeType !== 3 && node.lastChild.nodeType !== 3) 
                    return;
                
                this.unjiggle(node);
                
                const [lang,script] = (() => {
                    const s = node.lang.split('-');
                    return [s[0],s[s.length - 1]];
                })();
                
                if(!node.hasOwnProperty('origNode'))
                    node.origNode = node.cloneNode(true);

                const kids = node.childNodes;
                const starts_with_vowel = /^[aāiīuūeoêôṛṝl̥l̥̄ṃḥ]/;
                const ends_with_consonant = /[kgṅcjñṭḍṇtdnpbmyrlḷḻvṣśsh]$/;

                const telugu_vowels = ['ā','i','ī','e','o','_','ai','au'];
                const telu_cons_headstroke = ['h','k','ś','y','g','gh','c','ch','jh','ṭh','ḍ','ḍh','t','th','d','dh','n','p','ph','bh','m','r','ḻ','v','ṣ','s'];
                var telugu_del_headstroke = false;
                var telugu_kids = [];
                var add_at_beginning = [];
                const starts_with_text = (kids[0].nodeType === 3);

                for (let kid of kids) {
                    if(kid.nodeType > 3) continue;

                    const txt = kid.textContent.trim();
                    if(txt === '') continue;
                    if(txt === 'a') { 
                        kid.textContent = '';
                        continue;
                    }
                    if(txt === 'aḥ') {
                        kid.textContent = 'ḥ';
                        continue;
                    }

                    if(txt.match(ends_with_consonant)) {
                        // add 'a' if node ends in a consonant
                        const last_txt = findTextNode(kid,true);
                        last_txt.textContent = last_txt.textContent.replace(/\s+$/,'') + 'a';
                        if(script === 'Telu' &&
                       telu_cons_headstroke.indexOf(txt) >= 0) {
                        // if there's a vowel mark in the substitution, 
                        // remove the headstroke from any consonants
                            telugu_kids.push(kid);
                        }
                    }
                
                    // case 1, use aalt:
                    // ta<subst>d <del>ip</del><add>it</add>i</subst>
                    // case 2, use aalt:
                    // <subst>d <del>apy </del><add>ity </add>i</subst>va
                    // case 3, no aalt:
                    // <subst><del>apy </del><add>ity </add>i</subst>va
                
                    // use aalt if node is a text node
                    if(kid === node.lastChild && kid.nodeType === 3) {
                        const cap = document.createElement('span');
                        cap.appendChild(kid.cloneNode(false));
                        node.replaceChild(cap,kid);
                        kid = cap; // redefines 'kid'
                        //kid.classList.add('aalt',lang,script);
                        kid.classList.add('aalt');
                        kid.lang = node.lang;
                    }
                    else if(starts_with_text) {
                    // use aalt if node starts with a vowel
                    // or if there's a dangling consonant
                        if( (kid.nodeType === 1 && txt.match(starts_with_vowel)) || 
                            (kid.nodeType === 1 && ends_with_consonant))
                            kid.classList.add('aalt');
                    }
                    switch (script) {
                    case 'Deva':
                    case 'Nand':
                        if(txt === 'i') 
                            add_at_beginning.unshift(kid);
                        else if(txt === 'ê') {
                            kid.classList.remove('aalt');
                            kid.classList.add('cv01');
                            add_at_beginning.unshift(kid);
                        }
                        else if(txt === 'ô') {
                            const new_e = kid.cloneNode(true);
                            replaceTextInNode('ô','ê',new_e);
                            new_e.classList.remove('aalt');
                            new_e.classList.add('cv01');
                            add_at_beginning.unshift(new_e);
                            replaceTextInNode('ô','ā',kid);
                        }
                        else if(txt === 'aî') {
                            const new_e = kid.cloneNode(true);
                            replaceTextInNode('aî','ê',new_e);
                            new_e.classList.remove('aalt');
                            new_e.classList.add('cv01');
                            add_at_beginning.unshift(new_e);
                            replaceTextInNode('aî','e',kid);
                        }
                        else if(txt === 'aû') {
                            const new_e = kid.cloneNode(true);
                            replaceTextInNode('aû','ê',new_e);
                            new_e.classList.remove('aalt');
                            new_e.classList.add('cv01');
                            add_at_beginning.unshift(new_e);
                            replaceTextInNode('aû','o',kid);
                        }
                        break;
                    case 'Beng':
                    case 'Newa':
                    case 'Shrd':
                        if(txt === 'i') 
                            add_at_beginning.unshift(kid);
                        else if(txt === 'e' || txt === 'ai') {
                            add_at_beginning.unshift(kid);
                        }
                        else if(txt === 'o') {
                            const new_e = kid.cloneNode(true);
                            replaceTextInNode('o','e',new_e);
                            add_at_beginning.unshift(new_e);
                            replaceTextInNode('o','ā',kid);
                        }
                        else if(txt === 'au') {
                            const new_e = kid.cloneNode(true);
                            replaceTextInNode('au','e',new_e);
                            add_at_beginning.unshift(new_e);
                        }
                        break;
                    case 'Gran':
                    case 'Taml':
                    case 'Mlym':
                        if(txt === 'e' || txt === 'ē' || txt === 'ê' || 
                           txt === 'ai' || txt === 'aî')  {
                            add_at_beginning.unshift(kid);
                        }
                        else if(txt === 'o' || txt === 'ô') {
                            const new_e = kid.cloneNode(true);
                            replaceTextInNode(/[oōô]/,'e',new_e);
                            add_at_beginning.unshift(new_e);
                            replaceTextInNode(/[oōô]/,'ā',kid);
                        }
                        else if(txt === 'ō') {
                            const new_e = kid.cloneNode(true);
                            replaceTextInNode(/ō/,'ē',new_e);
                            add_at_beginning.unshift(new_e);
                            replaceTextInNode(/ō/,'ā',kid);
                        }
                        break;
                    case 'Telu':
                        if(!telugu_del_headstroke &&
                           telugu_vowels.indexOf(txt) >= 0)
                            
                            telugu_del_headstroke = true;
                        break;

                    }
                } // end for let kid of kids

                for (const el of add_at_beginning) {
                    node.insertBefore(el,node.firstChild);
                }

                if(telugu_del_headstroke) {
                    for (const el of telugu_kids) {
                        const lasttxtnode = findTextNode(el,true);
                        lasttxtnode.textContent = lasttxtnode.textContent + '\u200D\u0C4D';
                        //cache.set(lasttxtnode);
                    }
                }
                /*
                // cache text again since elements are moved around
                const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false);
                while(walker.nextNode()) cache.set(walker.currentNode);
                */
            },
        
            unjiggle(node) {
                if(node.hasOwnProperty('origNode'))
                    node.replaceWith(node.origNode);
            }

        };

        const to = {

            smush: function(text,d_conv = false) {
                // d_conv is DHARMA convention
                if(!d_conv) text = text.toLowerCase();
            
                // remove space between word-final consonant and word-initial vowel
                text = text.replace(/([gḍdrmvynhs]) ([aāiīuūṛeēoōêô])/g, '$1$2');
            
                if(d_conv) text = text.toLowerCase();
            
                // remove space between word-final consonant and word-intial consonant
                text = text.replace(/([kgcjñḍtdnpbmrlyẏvśṣsṙ]) ([kgcjṭḍtdnpbmyẏrlvśṣshḻ])/g, '$1$2');

                // join final o/e/ā and avagraha/anusvāra
                text = text.replace(/([oōeēā]) ([ṃ'])/g,'$1$2');

                text = text.replace(/ü/g,'\u200Cu');
                text = text.replace(/ï/g,'\u200Ci');

                text = text.replace(/_{1,2}(?=\s*)/g, function(match) {
                    if(match === '__') return '\u200D';
                    else if(match === '_') return '\u200C';
                });

                return text;
            },
            
            nums: function(text) {
                const newarr = [];
                const rev = text.split('').reverse();
                let offset = 0;
                for(let i=0; i < rev.length; i++) {
                    const num = rev[i];
                    const reps = i - offset;
                    if(/[23456789]/.test(num))
                        newarr.unshift(num + '⁰'.repeat(reps));
                    else if(num === '1') {
                        if(reps === 0) newarr.unshift('1');
                        else newarr.unshift('\u200c'+'⁰'.repeat(reps));
                    }
                    else if(num !== '0') {
                        newarr.unshift(num);
                        offset = i+1;
                    }
                    if(reps === 3) offset = i+1; // only goes up to 1000
                }
                return newarr.join('');
            },

            iast: function(text,from) {
                const f = from || 'tamil';
                const literated = Sanscript.t(text,f,'iast')
                    .replace(/^⁰|([^\d⁰])⁰/g,'$1¹⁰');
                    //.replace(/l̥/g,'ḷ');
                if(f !== 'tamil')
                    return literated.replace(/e/g,'ĕ')
                                    .replace(/ē/g,'e')
                                    .replace(/o(?!ṁ)/g,'ǒ')
                                    .replace(/ō/g,'o');
                else return literated;
            },
            
            tamil: function(text) {
                to.smush(text);
                const grv = new Map([
                    ['\u0B82','\u{11300}'],
                    ['\u0BBE','\u{1133E}'],
                    ['\u0BBF','\u{1133F}'],
                    ['\u0BC0','\u{11340}'],
                    ['\u0BC1','\u{11341}'],
                    ['\u0BC2','\u{11342}'],
                    ['\u0BC6','\u{11347}'],
                    ['\u0BC7','\u{11347}'],
                    ['\u0BC8','\u{11348}'],
                    ['\u0BCA','\u{1134B}'],
                    ['\u0BCB','\u{1134B}'],
                    ['\u0BCC','\u{1134C}'],
                    ['\u0BCD','\u{1134D}'],
                    ['\u0BD7','\u{11357}']
                ]);
                const grc = ['\u{11316}','\u{11317}','\u{11318}','\u{1131B}','\u{1131D}','\u{11320}','\u{11321}','\u{11322}','\u{11325}','\u{11326}','\u{11327}','\u{1132B}','\u{1132C}','\u{1132D}'];

                const smushed = text
                    .replace(/([kṅcñṭṇtnpmyrlvḻḷṟṉ])\s+([aāiīuūeēoō])/g, '$1$2')
                    //.replace(/ḷ/g,'l̥')
                    .replace(/(^|\s)_ā/g,'$1\u0B85\u200D\u0BBE')
                    .replace(/(\S)([AĀIĪUŪEĒOŌ])/g,'$1\u200C$2')
                    .replace(/(\S)·/g,'$1\u200C')
                    .toLowerCase();
                const rgex = new RegExp(`([${grc.join('')}])([${[...grv.keys()].join('')}])`,'g');
                const pretext = Sanscript.t(smushed,'iast','tamil');
                return pretext.replace(rgex, function(m,p1,p2) {
                    return p1+grv.get(p2); 
                });
            },
            grantha: function(txt) {
                const grv = new Map([
                    ['\u{11300}','\u0B82'],
                    ['\u{1133E}','\u0BBE'],
                    ['\u{1133F}','\u0BBF'],
                    ['\u{11340}','\u0BC0'],
                    ['\u{11341}','\u0BC1'],
                    ['\u{11342}','\u0BC2'],
                    ['\u{11347}','\u0BC6'],
                    ['\u{11348}','\u0BC8'],
                    ['\u{1134B}','\u0BCA'],
                    ['\u{1134C}','\u0BCC'],
                    ['\u{1134D}','\u0BCD'],
                    ['\u{11357}','\u0BD7']
                ]);
                const tmc = ['\u0BA9','\u0BB1','\u0BB3','\u0BB4'];
                const rgex = new RegExp(`([${tmc.join('')}])([${[...grv.keys()].join('')}])`,'gu');
                //const smushed = txt
                //    .replace(/([kṅcñṭṇtnpmyrlvḻ])\s+([aāiīuūeēoō])/g, '$1$2')
                //    .toLowerCase()
                const smushed = to.smush(txt,true)
                    .replace(/e/g,'ē')
                    .replace(/o(?![ṁḿ])/g,'ō')
                    //.replace(/ḿ/g,'ṁ') // no Jaina oṃkāra
                    .replace(/(\S)·/g,'$1\u200C');
                    //.replace(/ḷ/g,'l̥');
                const pretext = Sanscript.t(smushed,'iast','grantha');
                return pretext.replace(rgex, function(m,p1,p2) {
                    return p1+grv.get(p2); 
                });
            },
            malayalam: function(txt) {
                const chillu = {
                    'ക':'ൿ',
                    'ത':'ൽ',
                    'ന':'ൻ',
                    'മ':'ൔ',
                    'ര':'ർ',
                };

                const smushed = to.smush(txt,true)
                    .replace(/(^|\s)_ā/,'$1\u0D3D\u200D\u0D3E')
                    //.replace(/(^|\s)_r/,"$1\u0D3D\u200D\u0D30\u0D4D");
                    //FIXME (replaced by chillu r right now)
                    .replace(/(\S)·/g,'$1\u200C');
                
                const newtxt = Sanscript.t(smushed,'iast','malayalam')
                    // use chillu final consonants	
                    .replace(/([കതനമര])്(?![^\s\u200C,—’―])/g, function(match,p1) {
                        return chillu[p1];
                    });
    	
                /*
                const replacedtxt = _state.features.has('dotReph') ?
                    // use dot reph
                    newtxt.replace(/(^|[^്])ര്(?=\S)/g,'$1ൎ') :
                    newtxt;
                */
                const replacedtxt = newtxt.replace(/(^|[^്])ര്(?=\S)/g,'$1ൎ');

                return replacedtxt;
            },
            
            devanagari: function(txt) {

                const pretext = txt//.replace(/ṙ/g, 'r')
                    .replace(/e/g,'ē')
                    .replace(/o(?![ṁḿ])/g,'ō')
                    .replace(/([^aāiīuūeēoōṛṝl̥l̥̄])ṃ/,'$1\'\u200Dṃ') // standalone anusvāra
                    .replace(/([^aāiīuūeēoōṛṝl̥l̥̄])ḥ/,'$1\'\u200Dḥ') // standalone visarga
                    .replace(/(^|\s)_y/,'$1\'\u200Dy') // half-form of ya
                    .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                    .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

                const smushed = to.smush(pretext);

                const text = Sanscript.t(smushed,'iast','devanagari')
                    .replace(/¯/g, 'ꣻ');

                return text;
            },

            bengali: function(txt) {

                const pretext = txt//.replace(/ṙ/g, 'r')
                    .replace(/e/g,'ē')
                    .replace(/o(?![ṁḿ])/g,'ō')
                    .replace(/(^|\s)_ā/g,'$1\u093D\u200D\u093E')
                    .replace(/(^|\s)_r/g,'$1\u093D\u200D\u0930\u094D');

                const smushed = to.smush(pretext);

                const text = Sanscript.t(smushed,'iast','bengali')
                    .replace(/ত্(?=\s)|ত্$/g,'ৎ');
                return text;
            },

            telugu: function(txt) {

                const pretext = txt.replace(/(^|\s)_ā/,'$1\u0C3D\u200D\u0C3E')
                    .replace(/(^|\s)_r/,'$1\u0C3D\u200D\u0C30\u0C4D');
                // FIXME: should be moved to the right of the following consonant cluster

                const smushedtext = to.smush(pretext);
                //const replacedtext = _state.features.has('valapalagilaka') ?
                //    smushedtext.replace(/r(?=[kgcjṭḍṇtdnpbmyvlh])/,'ṙ') : smushedtext;
                const replacedtext = smushedtext.replace(/r(?=[kgcjṭḍṇtdnpbmyvlh])/,'ṙ');

                const posttext = replacedtext//.replace(/ê/g,'e') // no pṛṣṭhamātrās
                    //.replace(/ô/g,'o') // same with o
                    .replace(/ṙ/g,'r\u200D'); // valapalagilaka
                    //.replace(/ṁ/g,'ṃ') // no telugu oṃkāra sign
                    //.replace(/ḿ/g,'ṃ')
                    //.replace(/î/g,'i') // no pṛṣṭhamātrās
                    //.replace(/û/g,'u');

                return Sanscript.t(posttext,'iast','telugu');
            },
            
            newa: function(txt) {

                const pretext = txt//.replace(/ṙ/g, 'r')
                    .replace(/e/g,'ē')
                    .replace(/o(?![ṁḿ])/g,'ō');

                const smushed = to.smush(pretext);

                const text = Sanscript.t(smushed,'iast','newa');

                return text;
            },

            sarada: function(txt) {

                const pretext = txt//.replace(/ṙ/g, 'r')
                    .replace(/e/g,'ē')
                    .replace(/o(?![ṁḿ])/g,'ō');

                const smushed = to.smush(pretext);

                const text = Sanscript.t(smushed,'iast','sarada')
                    .replace(/¯/g, '\u{111DC}');
                return text;
            },

            nandinagari: function(txt) {

                const pretext = txt//.replace(/ṙ/g, 'r')
                    .replace(/e/g,'ē')
                    .replace(/o(?![ṁḿ])/g,'ō');

                const smushed = to.smush(pretext);

                const text = Sanscript.t(smushed,'iast','nandinagari')
                    .replace(/¯/g, '\u{119E3}');
                return text;
            },
        };
        
        for(const [key, val] of _state.scriptToIso) {
            to[val] = to[key];
        }
        
        const findTextNode  = function(node,last = false) {
            if(node.nodeType === 3) return node;
            const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false);
            if(!last) return walker.nextNode;
            else {
                let txt;
                while(walker.nextNode())
                    txt = walker.currentNode;
                return txt;
            }
        };

        const replaceTextInNode = function(text, replace, node) {
            const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false);
            while(walker.nextNode()) {
                const cur_txt = walker.currentNode.textContent;
                if(cur_txt.match(text))
                    walker.currentNode.textContent = replace;
            }
        };
        
        return Object.freeze({
            init: init,
            to: to,
            scripts: function() { return _state.scriptnames;},
            refreshCache: (par) => {
                const walker = document.createTreeWalker(par,NodeFilter.SHOW_ALL);
                prepTextWalker(walker);
            },
            activate: transliterator.activate,
            revert: transliterator.revert

        });
    }());

    const latestCommits = () => {
        const loc = window.location;
        if(loc.hostname.endsWith('.github.io')) {
            const sub = loc.hostname.split('.',1)[0];
            const pathsplit = loc.pathname.split('/');
            pathsplit.shift(); // pathname starts with a slash
            const repo = pathsplit.shift();
            const path = pathsplit.join('/');
            const apiurl = `https://api.github.com/repos/${sub}/${repo}/commits?path=${path}`;
            fetch(apiurl)
                .then((resp) => {
                    if(resp.ok)
                        return resp.json();
                })
                .then((data) => {
                    if(data) {
                        const date = new Date(data[0].commit.committer.date);
                        const datestr = date.toLocaleString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        const span = document.getElementById('latestcommit');
                        span.innerHTML = `Last updated <a href="${data[0].html_url}">${datestr}</a>.`;
                    }
                });
        }
    };

    const GitHubFunctions = {
        latestCommits: latestCommits
    };

    const needlemanWunsch = (s1,s2,op={G:2,P:1,M:-1}) => {
        const UP   = Symbol('UP');
        const LEFT = Symbol('LEFT');
        const UL   = Symbol('UP-LEFT');

        const mat   = {};
        const direc = {};
        //const s1arr = s1.split('');
        const s1arr = s1;
        const s1len = s1arr.length;
        //const s2arr = s2.split('');
        const s2arr = s2;
        const s2len = s2arr.length;

        // initialization
        for(let i=0; i<s1len+1; i++) {
            mat[i] = {0:0};
            direc[i] = {0:[]};
            for(let j=1; j<s2len+1; j++) {
                mat[i][j] = (i === 0) ? 0 : 
                    (s1arr[i-1] === s2arr[j-1]) ? op.P : op.M;
                direc[i][j] = [];
            }
        }

        // calculate each value
        for(let i=0; i<s1len+1; i++) {
            for(let j=0; j<s2len+1; j++) {
                const newval = (i === 0 || j === 0) ? 
                    -op.G * (i + j) : 
                    Math.max(mat[i-1][j] - op.G, mat[i-1][j-1] + mat[i][j], mat[i][j-1] - op.G);
                if (i > 0 && j > 0) {

                    if( newval === mat[i-1][j] - op.G) direc[i][j].push(UP);
                    if( newval === mat[i][j-1] - op.G) direc[i][j].push(LEFT);
                    if( newval === mat[i-1][j-1] + mat[i][j]) direc[i][j].push(UL);
                }
                else {
                    direc[i][j].push((j === 0) ? UP : LEFT);
                }
                mat[i][j] = newval;
            }
        }

        // get result
        const chars = [[],[]];
        var I = s1len;
        var J = s2len;
        //const max = Math.max(I, J);
        while(I > 0 || J > 0) {
            switch (direc[I][J][0]) {
            case UP:
                I--;
                chars[0].unshift(s1arr[I]);
                chars[1].unshift('');
                break;
            case LEFT:
                J--;
                chars[0].unshift('');
                chars[1].unshift(s2arr[J]);
                break;
            case UL:
                I--;
                J--;
                chars[0].unshift(s1arr[I]);
                chars[1].unshift(s2arr[J]);
                break;
            }
        }

        return chars;
    };

    var Transliterate;
    const setTransliterator = (obj) => Transliterate = obj;
    var Debugging$1 = false;

    const nextSibling$1 = (node) => {
        let start = node;
        while(start) {
            const sib = start.nextSibling;
            if(sib) return sib;
            else start = start.parentElement; 
        }
        return null;
    };

    const nextTextNode$1 = (start) => {
        let next = nextSibling$1(start);
        while(next) {
            if(next.nodeType === 3) return next;
            else next = next.firstChild || nextSibling$1(next);
        }
        return null;
    };

    const prevSibling = (node) => {
        let start = node;
        while(start) {
            const sib = start.previousSibling;
            if(sib) return sib;
            else start = start.parentElement; 
        }
        return null;
    };

    const prevTextNode = (start) => {
        let prev = prevSibling(start);
        while(prev) {
            if(prev.nodeType === 3) return prev;
            else prev = prev.lastChild || prevSibling(prev);
        }
        return null;
    };

    const countpos$1 = (str, pos) => {
        if(pos === 0) return 0;
        let realn = 0;
        for(let n=1;n<=str.length;n++) {
           if(str[n] !== '\u00AD')
               realn = realn + 1;
            if(realn === pos) return n;
        }
    };

    const findEls = (range) => {
        const container = range.cloneContents();
        if(container.firstElementChild) return true;
        return false;
    };

    const highlight = {
        inline(targ) {
            const par = targ.closest('div.text-block');
            if(!par) return;

            const allleft = [...par.querySelectorAll('.lem-inline')];
            const pos = allleft.indexOf(targ);
            const right = par.parentElement.querySelector('.apparatus-block');
            const allright = right.querySelectorAll(':scope > .app > .lem');
            allright[pos].classList.add('highlit');
        },
        apparatus(targ) {
            const par = targ.closest('div.apparatus-block');
            if(!par) return;
            const left = par.parentElement.querySelector('.text-block'); // or .edition?
            if(targ.dataset.corresp) {
                if(document.getElementById('transbutton').lang === 'en') {
                    Transliterate.revert(left);
                }
                highlightcoords(targ,left);
                if(document.getElementById('transbutton').lang === 'en') {
                    Transliterate.refreshCache(left);
                    Transliterate.activate(left);
                }
            }
            else {
                const allright = [...par.querySelectorAll(':scope > .app > .lem')];
                const pos = allright.indexOf(targ);
                const allleft = left.querySelectorAll('.lem-inline');
                if(allleft.length !== 0)
                   allleft[pos].classList.add('highlit');
            }
        },
    };

    const suggestLemmata = (lemma, par) => {
        if(document.getElementById('transbutton').lang === 'en') {
            Transliterate.revert(par);
        }
        const haystack = par.textContent.replaceAll('\u00AD','');
        const re = new RegExp(lemma.dataset.text.replaceAll(/\s/g,'\\s+'),'g');
        let res = re.exec(haystack);
        const coords = [];
        while(res !== null) {
            coords.push([res.index,res.index + res[0].length]);
            res = re.exec(haystack);
        }
        const ranges = [];
        for(const coord of coords) {
            ranges.push([highlightcoord(coord, lemma, par, permalightrange),coord]);
        }
        if(document.getElementById('transbutton').lang === 'en') {
            Transliterate.refreshCache(par);
            Transliterate.activate(par);
        }
        for(const range of ranges) showRangeCoords(...range);
    };

    const getOffset = (el) => {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
    };
    const showRangeCoords = (startel,coord) => {
            const placement = getOffset(startel);
            const tBox = document.createElement('div');
            const tBoxDiv = document.createElement('div');
            tBox.className = 'coord-suggestion';
            document.body.appendChild(tBox);

            tBox.style.top = (placement.top - 35) + 'px';
            tBox.style.left = placement.left + 'px';
            tBoxDiv.append(coord.join(','));
            tBox.appendChild(tBoxDiv);

            tBox.animate([
                {opacity: 0 },
                {opacity: 1, easing: 'ease-in'}
                ], 200);
    };
    const textPosInElement = (el,pos) => {
        const walker = document.createTreeWalker(el,NodeFilter.SHOW_TEXT, { acceptNode() {return NodeFilter.FILTER_ACCEPT;}});
        let start = 0;
        let cur = walker.currentNode;
        while(walker.nextNode()) {
            cur = walker.currentNode;
            const clean = cur.data.replaceAll('\u00AD','');
            const end = start + clean.length;
            if(pos <= end)
                return [cur,countpos$1(cur.data,pos-start)];
            start = end;
        }
        if(!cur.data) // if there is no text node
            return [nextTextNode$1(cur),0];
        else return [cur,cur.data.length];
    };

    const rangeFromCoords = (positions, lem, target) => {
        const range = document.createRange();

        const realNextSibling = (walker) => {
            let cur = walker.currentNode;
            while(cur) {
                const sib = walker.nextSibling();
                if(sib) return sib;
                cur = walker.parentNode();
            }
            return null;
        };

        const walker = document.createTreeWalker(target,NodeFilter.SHOW_ALL, { acceptNode() {return NodeFilter.FILTER_ACCEPT;}});
        let start = 0;
        let oldstart = 0;
        let started = false;
        let cur = walker.nextNode();
        /*
        if(target.closest('.lg')) { // skip spaces at the beginning
            while(cur.nodeType !== 1 || !cur.classList.contains('l'))
                cur = walker.nextNode();
        }
        */
        let startToAdjust = null;
        let endToAdjust = null;
        while(cur) {
            if(cur.nodeType === 1) {
                
                if(cur.nodeName === 'SPAN' && 
                   cur.parentNode.classList.contains('choice') &&
                   cur !== cur.parentNode.firstChild) {

                    cur = realNextSibling(walker);
                    continue;
                }

                if(!cur.myOldContent) {
                    cur = walker.nextNode();
                    continue;
                }
                const clean = cur.myOldContent.textContent.replaceAll('\u00AD','');
                
                cur.textContent.replaceAll('\u00AD','');
                /*
                if(clean.length === newclean.length) { 
                    // skips setting startToAdjust/endToAdjust
                    // this can cause problems if the word split adds a character and removes a character, making the string length the same
                    cur = walker.nextNode();
                    continue;
                }
                */

                const oldend = oldstart + clean.length;
                const newend = start + clean.length;
                if(!started && positions[0] <= oldend) {
                    const [textnode, textnodepos] = textPosInElement(cur,positions[0]-oldstart);
                    startToAdjust = true;
                    range.setStart(textnode,textnodepos);
                    started = true;
                }
                if(positions[1] <= oldend) {
                    const [textnode, textnodepos] = textPosInElement(cur,positions[1]-oldstart);
                    endToAdjust = true;
                    range.setEnd(textnode,textnodepos);
                    break;
                }
                start = newend;
                oldstart = oldend;
                cur = realNextSibling(walker);
            }
            else if(cur.nodeType === 3) {
                const clean = cur.data.replaceAll('\u00AD','');
                const end = start + clean.length;
                if(!started && positions[0] <= end) {
                    const realpos = countpos$1(cur.data,positions[0]-start);
                    range.setStart(cur,realpos);
                    started = true;
                }
                if(positions[1] <= end) {
                    const realpos = countpos$1(cur.data,positions[1]-start);
                    range.setEnd(cur,realpos);
                    break;
                }
                start = end;
                oldstart = oldstart + clean.length;
                cur = walker.nextNode();
            }
        }
        
        if(startToAdjust || endToAdjust) 
            // if start/end containers are in word splits
            realignToWordSplits(range,lem,startToAdjust,endToAdjust);
        if(range.startOffset === range.startContainer.data.length) {
            // move to the beginning of the next text node
            range.setStart(nextTextNode$1(range.startContainer),0);
            // if there is no next text node something is wrong
        }
        return range;
    };

    const realignToWordSplits = (range,lem,startSeg,endSeg) => {
        if(startSeg && range.startOffset > 0)
            range.setStart(range.startContainer,range.startOffset-1);
        if(endSeg && range.endOffset < range.endContainer.data.length)
            range.setEnd(range.endContainer,range.endOffset+1);
        const lemtext = lem.dataset.text;

        const aligned = needlemanWunsch(range.toString(),lemtext);
        const startShiftLeft = countGaps(aligned[0],0);
        const startShiftRight = countGaps(aligned[1],0);
        const endShiftRight = countGaps(aligned[0],1);
        const endShiftLeft = countGaps(aligned[1],1);
       
        const newstart = range.startOffset - startShiftLeft - startShiftRight;
        if(newstart < 0) {
            let newcontainer = prevTextNode(range.startContainer);
            while(newcontainer.data === '' || 
                  newcontainer.data === ' ' ||
                wrongSeg(newcontainer)) {
                newcontainer = prevTextNode(newcontainer);
            }
            range.setStart(newcontainer,newcontainer.data.length+newstart);
        }
        else
            range.setStart(range.startContainer,newstart);
        
        const newend = range.endOffset - endShiftLeft + endShiftRight;
        if(newend > range.endContainer.data.length) {
            let newcontainer = nextTextNode$1(range.endContainer);
            while(newcontainer.data === '' || 
                  newcontainer.data === ' ' ||
                  wrongSeg(newcontainer)) {
                newcontainer = nextTextNode$1(newcontainer);
            }
            range.setEnd(newcontainer,newend - range.endOffset);
        }
        else
            range.setEnd(range.endContainer,newend);
    };

    const countGaps = (arr,dir = 0) => {
       let count = 0;
       const clone = dir ? [...arr].reverse() : [...arr];
       for(const c of clone) {
           if(c === '') count += 1;
           else break;
       }
       return count;
    };

    const highlightcoords = (lem,target) => {
        const multiple = lem.dataset.corresp.split(';').reverse();
        for(const coord of multiple) highlightcoord(coord.split(','), lem, target);
    };

    const wrongSeg = (txtnode) => {
        const el = txtnode.parentNode.closest('.choice > span');
        return el && el !== el.parentNode.firstChild;
    };

    const highlightrange = (range,classname = 'highlit') => {
        const lemma = document.createElement('span');
        lemma.className = `${classname} temporary`;
        lemma.append(range.extractContents());
        range.insertNode(lemma);
        lemma.lang = lemma.parentElement.lang;
        return lemma;
    };

    const permalightrange = (range) => highlightrange(range,'permalit');

    const highlightcoord = (positions, lem, target, highlightfn = highlightrange) => {
        const range = rangeFromCoords(positions, lem, target);
        if(!findEls(range))
            return highlightfn(range);

        const toHighlight = [];
        const start = (range.startContainer.nodeType === 3) ?
            range.startContainer :
            range.startContainer.childNodes[range.startOffset];

        const end = (range.endContainer.nodeType === 3) ?
            range.endContainer :
            range.endContainer.childNodes[range.endOffset-1];

        if(start.nodeType === 3 && range.startOffset !== start.length && !wrongSeg(start)) {
            const textRange = document.createRange();
            textRange.setStart(start,range.startOffset);
            textRange.setEnd(start,start.length);
            toHighlight.push(textRange);
        }
        
        const getNextNode = (n) => n.firstChild || nextSibling$1(n);

        for(let node = getNextNode(start); node !== end; node = getNextNode(node)) {
            if(node.nodeType === 3 && !wrongSeg(node)) {
                const textRange = document.createRange();
                textRange.selectNode(node);
                toHighlight.push(textRange);
            }
        }

        if(end.nodeType === 3 && range.endOffset > 0 && !wrongSeg(end)) {
            const textRange = document.createRange();
            textRange.setStart(end,0);
            textRange.setEnd(end,range.endOffset);
            toHighlight.push(textRange);
        }
        
        const firsthighlit = highlightfn(toHighlight.shift());

        for(const hiNode of toHighlight)
            highlightfn(hiNode);

        target.normalize();
        return firsthighlit;
    };

    const unhighlight = (targ) => {
        const highlit = /*par*/document.querySelectorAll('.highlit');
        if(highlit.length === 0) return;
        
        targ = targ ? targ.closest('div.wide') : highlit[0].closest('div.wide');
        const par = targ.querySelector('.text-block'); // or .edition?
        if(!par) return;
        if(document.getElementById('transbutton').lang === 'en') {
            Transliterate.revert(par);
        }
        for(const h of highlit) {
            if(h.classList.contains('temporary')) {
                while(h.firstChild)
                    h.after(h.firstChild);
                h.remove();
            }
            else h.classList.remove('highlit');
        }
        par.normalize();
        Transliterate.refreshCache(par);
        if(document.getElementById('transbutton').lang === 'en') {
            Transliterate.activate(par);
        }
    };

    const unpermalight = () => {
        const highlit = /*par*/document.querySelectorAll('.permalit');
        if(highlit.length === 0) return;
        
        const targ = highlit[0].closest('div.wide');
        const par = targ.querySelector('.text-block'); // or .edition?
        if(!par) return;
        if(document.getElementById('transbutton').lang === 'en') {
            Transliterate.revert(par);
        }
        for(const h of highlit) {
            if(h.classList.contains('temporary')) {
                while(h.firstChild)
                    h.after(h.firstChild);
                h.remove();
            }
            else h.classList.remove('permalit');
        }
        par.normalize();
        Transliterate.refreshCache(par);
        if(document.getElementById('transbutton').lang === 'en') {
            Transliterate.activate(par);
        }
    };

    const Events$1 = { 
        docMouseover(e) {
            const lem_inline = e.target.closest('.lem-inline');
            if(lem_inline) highlight.inline(lem_inline);
            const lem = e.target.closest('.lem');
            if(lem) {
                highlight.apparatus(lem);
            }
        },

        docMouseout(e) {
            if(e.target.closest('.lem') ||
               e.target.closest('.lem-inline'))
                unhighlight(e.target);
        },
        docClick(e) {
            for(const tooltip of document.querySelectorAll('.coord-suggestion'))
                tooltip.remove();
            unpermalight(); 

            const targ = e.target.closest('.lemmalookup');
            if(!targ) return;
            const par = targ.closest('div.apparatus-block');
            if(!par) return;
            const left = par.parentElement.querySelector('.text-block');
            const lemma = targ.nextSibling;
            suggestLemmata(lemma,left);

        },
    };

    const init = () => {
        document.addEventListener('mouseover',Events$1.docMouseover);
        document.addEventListener('mouseout',Events$1.docMouseout);
        if(Debugging$1) document.addEventListener('click',Events$1.docClick);
    };

    const ApparatusViewer = {
        init: init,
        setTransliterator: setTransliterator,
        debug: () => Debugging$1 = true
    };

    const addwordsplit = (e) => {
        Papa.parse(e.target.files[0], {
            complete: (res) => {
                const data = res.data;
                if(data[0][0] === 'Word') data.shift();
                showsplits(data);
            }
        });
    };

    const showsplits = (arr) => {
        const concated = arr.map(el => el[0]).join(' ');
        const textblock = document.querySelector('.text-block');
        const text = textblock.textContent.replaceAll('\u00AD','');
        const aligned = needlemanWunsch(text,concated);
        const splits = alignmentToSplits(aligned,arr.map(el => el[1]));
        const id = textblock.closest('[id]').id;
        makepopup(`<standOff corresp="#${id}" type="wordsplit">\n` + 
            makeEntries(splits).join('\n') +
            '\n</standOff>');
    };

    const makepopup = (str) => {
        const popup = document.createElement('div');
        popup.className = 'popup';
        const code = document.createElement('code');
        code.className = 'language-xml';
        code.style.whiteSpace = 'pre';
        code.append(str);
        popup.append(code);
        const blackout = document.createElement('div');
        blackout.id = 'blackout';
        blackout.append(popup);
        Prism.highlightAllUnder(popup);
        document.body.appendChild(blackout);
        blackout.addEventListener('click',(e) => {
            const targ = e.target.closest('.popup');
            if(!targ)
                document.querySelector('#blackout').remove();
        });
    };

    const alignmentToSplits = (aligned, translations) => {
        let words = [];
        let wordstart = 0;
        let wordend = 0;
        let curword = '';
        for(let n=0; n<aligned[0].length;n++) {
            if(aligned[1][n].match(/[\n\s]/)) {
                const ret = {word: curword, start: wordstart, end: wordend};
                const translation = translations.shift();
                if(translation) ret.translation = translation;
                words.push(ret);

                curword = '';
                if(aligned[0][n].match(/[\n\s]/))
                    wordstart = wordend + 1;
                else wordstart = wordend;
            }
            else {
                if(curword === '' && aligned[0][n].match(/[\n\s]/))
                    wordstart = wordend + 1;
                curword += aligned[1][n];
            }

            if(aligned[0][n] !== '') wordend += 1;
        }
        if(curword) { // might be "" if wordsplit is only partial
            const ret = {word: curword, start: wordstart, end: wordend};
            const translation = translations.shift();
            if(translation) ret.translation = translation;
            words.push(ret);
        }

        return words;
    };
    const makeEntries = (list) => {
        const formatWord = (w) => {
            return w.replace(/([~+()])/g,'<pc>$1</pc>')
                    .replaceAll(/['’]/g,'<pc>(</pc>u<pc>)</pc>')
                    //.replaceAll(/\[(.+?)\]/g,'<supplied>$1</supplied>');
                    .replaceAll(/\[(.+?)\]/g,'$1');
        };
        return list.map(e => {
            const select = e.hasOwnProperty('strand') ? ` select="${e.strand}"` : '';
            const translation = e.hasOwnProperty('translation') ? `\n    <def>${e.translation}</def>` : '';
            return `  <entry corresp="${e.start},${e.end}"${select}>\n    <form>${formatWord(e.word)}</form>${translation}\n</entry>`;
        });
    };

    const Events = {
        docMouseover: (e) => {
            var targ = e.target.closest('[data-anno]');
            while(targ && targ.hasAttribute('data-anno')) {
               
                //ignore if apparatus is already on the side
                if(document.getElementById('record-fat') && 
                   targ.classList.contains('app-inline') &&
                   !targ.closest('.teitext').querySelector('.diplo') ) {
                    targ = targ.parentNode;
                    continue;
                }

                ToolTip.make(e,targ);
                targ = targ.parentNode;
            }
        }
    };

    const ToolTip = {
        make: function(e,targ) {
            const toolText = targ.dataset.anno || targ.querySelector(':scope > .anno-inline')?.cloneNode(true);
            if(!toolText) return;

            var tBox = document.getElementById('tooltip');
            const tBoxDiv = document.createElement('div');

            if(tBox) {
                for(const kid of tBox.childNodes) {
                    if(kid.myTarget === targ)
                        return;
                }
                tBoxDiv.appendChild(document.createElement('hr'));
            }
            else {
                tBox = document.createElement('div');
                tBox.id = 'tooltip';
                //tBox.style.opacity = 0;
                //tBox.style.transition = 'opacity 0.2s ease-in';
                document.body.appendChild(tBox);
                tBoxDiv.myTarget = targ;
            }

            tBox.style.top = (e.clientY + 10) + 'px';
            tBox.style.left = e.clientX + 'px';
            tBoxDiv.append(toolText);
            tBoxDiv.myTarget = targ;
            tBox.appendChild(tBoxDiv);
            targ.addEventListener('mouseleave',ToolTip.remove,{once: true});

            //window.getComputedStyle(tBox).opacity;
            //tBox.style.opacity = 1;
            tBox.animate([
                {opacity: 0 },
                {opacity: 1, easing: 'ease-in'}
                ], 200);
        },
        remove: function(e) {
            const tBox = document.getElementById('tooltip');
            if(!tBox) return;

            if(tBox.children.length === 1) {
                tBox.remove();
                return;
            }

            const targ = e.target;
            for(const kid of tBox.childNodes) {
                if(kid.myTarget === targ) {
                    kid.remove();
                    break;
                }
            }
            if(tBox.children.length === 1) {
                const kid = tBox.firstChild.firstChild;
                if(kid.tagName === 'HR')
                    kid.remove();
            }
        },
    };

    document.addEventListener('mouseover',Events.docMouseover);
    document.addEventListener('click',ToolTip.remove);

    //import { tamilize, iastToTamil } from './transliterate.mjs';

    var Debugging = false;

    const lookup = (e) => {
    //if(e.target.nodeName === 'RT' || e.target.classList?.contains('word')) {
        const word = e.target.closest('.word');
        if(word) {
            //const clean = e.target.dataset.norm.trim();
            //const clean = word.querySelector('.anno-inline span').textContent;
            const clone = word.cloneNode(true);
            for(const pc of clone.querySelectorAll('.invisible'))
                pc.remove();
            const clean = clone.textContent.replaceAll('\u00AD','');
            window.open(`https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py?qs=${clean}&amp;searchhws=yes&amp;matchtype=exact`,'lexicon',/*'height=500,width=500'`*/);
        }
    };

    const apparatusswitch = (e) => {
        const blocks = document.querySelectorAll('.wide');
        const target = document.getElementById('apparatusbutton');
        if(target.dataset.anno === 'apparatus of variants') {
            for(const block of blocks) {
                const trans = block.querySelector('.text-block.translation');
                if(trans) trans.style.display = 'none';
                const app = block.querySelector('.apparatus-block');
                if(app) app.style.display = 'block';
            }
            document.getElementById('translationsvg').style.display = 'revert';
            document.getElementById('apparatussvg').style.display = 'none';
            target.dataset.anno = 'translation';
        }
        else {
            for(const block of blocks) {
                const trans = block.querySelector('.text-block.translation');
                if(trans) trans.style.display = 'block';
                const app = block.querySelector('.apparatus-block');
                if(app) app.style.display = 'none';
            }
            document.getElementById('translationsvg').style.display = 'none';
            document.getElementById('apparatussvg').style.display = 'revert';
            target.dataset.anno = 'apparatus of variants';
        }
    };

    const wordsplit = (e) => {
        const target = document.getElementById('wordsplitbutton');
        document.getElementById('transbutton').lang === 'en' ? 'taml' : 'iast';
        const standoffs = document.querySelectorAll('.standOff[data-type="wordsplit"]');
        if(target.dataset.anno === 'word-split text') {
            for(const standoff of standoffs) {
                const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''))?.querySelector('.edition');
            
                if(document.getElementById('transbutton').lang === 'en') {
                    Transliterate$1.revert(target);
                }
                applymarkup(standoff);
                Transliterate$1.refreshCache(target);
                if(document.getElementById('transbutton').lang === 'en') {
                    Transliterate$1.activate(target);
                }
            }
            document.getElementById('metricalsvg').style.display = 'revert';
            document.getElementById('wordsplitsvg').style.display = 'none';
            target.dataset.anno = 'metrical text';
        }
        else {
            for(const standoff of standoffs) {
                const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''))?.querySelector('.edition');
                if(document.getElementById('transbutton').lang === 'en')
                    Transliterate$1.revert(target);
                removemarkup(standoff);
                Transliterate$1.refreshCache(target);
                if(document.getElementById('transbutton').lang === 'en') {
                    Transliterate$1.activate(target);
                }
            }
            document.getElementById('metricalsvg').style.display = 'none';
            document.getElementById('wordsplitsvg').style.display = 'revert';
            target.dataset.anno = 'word-split text';
        }
    };

    const countpos = (str, pos) => {
        if(pos === 0) return 0;
        let realn = 0;
        for(let n=1;n<=str.length;n++) {
           if(str[n] !== '\u00AD')
               realn = realn + 1;
            if(realn === pos) return n;
        }
    };
    const nextSibling = (node) => {
        let start = node;
        while(start) {
            let sib = start.nextSibling;
            if(sib) return sib;
            else start = start.parentElement; 
        }
        return false;
    };

    const nextTextNode = (start,strand) => {
        let next = nextSibling(start);
        while(next) {
            if(next.nodeType === 3) return next;
            else {
                if(next.parentNode.classList.contains('choice') &&
                   [...next.parentNode.children].indexOf(next) !== strand) {
                    next = nextSibling(next);
                }
                else next = next.firstChild || nextSibling(next);
            }
        }
        return null;
    };

    const realNextSibling = (walker) => {
        let cur = walker.currentNode;
        while(cur) {
            const sib = walker.nextSibling();
            if(sib) return sib;
            cur = walker.parentNode();
        }
        return null;
    };

    const applymarkup = (standoff) => {
        const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''))?.querySelector('.edition');
        if(!target) return;
        
        const fss = [...standoff.querySelectorAll('.fs')]
            .filter(fs => fs.dataset.corresp)
            .map(fs => {
                const pos = fs.dataset.corresp.split(',');
                const translation = fs.querySelector('[data-name="translation"]');
                const ret = {
                    start: pos[0],
                    end: pos[1],
                    strand: fs.dataset.hasOwnProperty('select') ? parseInt(fs.dataset.select) : 0,
                    lemma: fs.querySelector('[data-name="lemma"]'),
                    duplicate: fs.dataset.rend === 'none',
                };
                if(translation) ret.translation = translation.cloneNode(true);
                return ret;
        });
        const strandpositions = new Map();
        for(const fs of fss) {
            const strand = fs.strand;
            if(!strandpositions.has(strand))
                strandpositions.set(strand,[]);
            
            const posset = strandpositions.get(strand);
            if(!posset.includes(fs.start)) posset.push(fs.start);
            if(!posset.includes(fs.end)) posset.push(fs.end);
        }

        const posmaps = [];
        const starts = [];
        for(let n=0;n<strandpositions.size;n++)  {
            posmaps.push(new Map());
            starts.push(0);
        }

        const walker = document.createTreeWalker(target,NodeFilter.SHOW_ALL);
        let cur = walker.nextNode();
        /*
        if(target.closest('.lg')) { // skip spaces at the beginning
            while(cur.nodeType !== 1 || !cur.classList.contains('l'))
                cur = walker.nextNode();
        }
        */
        while(cur) {
            if(cur.nodeType === 1) {
                if(cur.parentNode.classList.contains('choice')) {
                    const strand = [...cur.parentNode.children].indexOf(cur);
                    const walker2 = document.createTreeWalker(cur,NodeFilter.SHOW_TEXT);
                    while(walker2.nextNode()) {
                        const cur2 = walker2.currentNode;
                        const clean = cur2.data.replaceAll('\u00AD','');
                        const end = starts[strand] + clean.length;
                        const positions = strandpositions.get(strand);
                        while(positions[0] <= end) {
                            const pos = positions.shift();
                            const realpos = countpos(cur2.data,pos-starts[strand]);
                            posmaps[strand].set(pos,{node: cur2, pos: realpos});
                        }
                        starts[strand] = end;
                    }
                    cur = realNextSibling(walker);
                }
                else cur = walker.nextNode();
            }
            else {
                const clean = cur.data.replaceAll('\u00AD','');
                for(const [strand,positions] of strandpositions) {
                    const end = starts[strand] + clean.length;
                    while(positions[0] <= end) {
                        const pos = positions.shift();
                        const realpos = countpos(cur.data,pos-starts[strand]);
                        posmaps[strand].set(pos,{node: cur, pos: realpos});
                    }
                    starts[strand] = end;
                }
                cur = walker.nextNode();
            }
        }
        const ranges = [];
        for(const fs of fss) {
            const strand = parseInt(fs.strand);
            const start = posmaps[strand].get(fs.start);
            const end = posmaps[strand].get(fs.end);
            const range = document.createRange();
            if(start.pos === start.node.data.length) {
                // move to the beginning of the next text node in the right strand
                range.setStart(nextTextNode(start.node,strand),0);
                // if there is no next text node something is wrong
            }
            else
                range.setStart(start.node,start.pos);
            
            range.setEnd(end.node,end.pos);
            ranges.push({range: range, fs: fs});
        }
        const lastTextNode = (par) => {
            const walker = document.createTreeWalker(par,NodeFilter.SHOW_TEXT);
            let ret;
            while(walker.nextNode()) ret = walker.currentNode;
            return ret;
        };

        const clipEnd = (range) => {
            const clip = new Range();
            clip.setStart(range.range.endContainer,0);
            clip.setEnd(range.range.endContainer,range.range.endOffset);
            const toremove = document.createElement('span');
            toremove.className = 'placeholder';
            toremove.myOldContent = clip.extractContents();
            toremove.dataset.myOldContent = toremove.myOldContent.textContent;
            clip.insertNode(toremove);
        };
        for(const word of ranges) {
            if(word.range.startContainer.data.length === word.range.startOffset) {
                // move start past the previous range that was surrounded
                const nextsib = word.range.startContainer.nextSibling.nextSibling;
                word.range.setStart(nextsib,0);
            }
            const startseg = word.range.startContainer.parentNode.closest('.choice > span');
            const endseg = word.range.endContainer.parentNode.closest('.choice > span');
            if(startseg && endseg !== startseg) {
                if(word.range.endContainer.data.length !== 0)  {
                    // clip the end bit if it hasn't been clipped already
                    clipEnd(word);
                }

                const lasttext = lastTextNode(startseg);
                word.range.setEnd(lasttext,lasttext.data.length);
            }
            else if(endseg && !startseg) {
                if(word.range.endContainer.data.length !== 0)  {
                    clipEnd(word);
                }

                word.range.setEnd(word.range.startContainer,word.range.startContainer.data.length);
            }
            else {
                const startl = word.range.startContainer.parentNode.closest('.l');
                const endl = word.range.endContainer.parentNode.closest('.l');
                if(startl !== endl) {
                    clipEnd(word);
                    word.range.setEnd(word.range.startContainer,word.range.startContainer.data.length);
                }
            }
            /*
            const ruby = document.createElement('ruby');
            //word.range.surroundContents(ruby);
            
            ruby.appendChild(word.range.extractContents());
            word.range.insertNode(ruby);
            
            const br = ruby.querySelector('br');
            if(br) ruby.after(br);
            
            const rt = document.createElement('rt');
            rt.append(word.fs.lemma);
            rt.append('\u200B');
            ruby.appendChild(rt);
            */
            const span = document.createElement('span');
            span.className = 'word split';
            
            span.myOldContent = word.range.extractContents();
            span.dataset.myOldContent = span.myOldContent.textContent;
            word.range.insertNode(span);

            span.lang = span.parentNode.lang;
            
            /*
            const br = word.myOldContent.querySelector('br');
            if(br) {
                const newbr = br.cloneNode(true);
                newbr.classList.add('toremove');
                word.after(newbr);
            }
            */
            const clone = word.fs.lemma.cloneNode(true);
            while(clone.firstChild) {
                if(clone.firstChild.nodeType === 1)
                    clone.firstChild.lang = 'ta-Latn-t-ta-Taml'; // there's probably a better way
                span.append(clone.firstChild);
            }
            if(word.fs.duplicate)
                span.style.display = 'none';
            if(word.fs.translation) 
                span.dataset.anno = word.fs.translation.textContent;
        }
    };

    const removemarkup = (standoff) => {
        const target = document.getElementById(standoff.dataset.corresp.replace(/^#/,''));
        if(!target) return;

        for(const toremove of target.querySelectorAll('.toremove')) {
            while(toremove.firstChild)
                toremove.after(toremove.firstChild);
            toremove.remove();
        }
        for(const word of target.querySelectorAll('span.word, span.placeholder')) {
            word.replaceWith(word.myOldContent);
        }
        target.normalize();
    };

    const go = () => {
        const scripttag = document.getElementById('editionscript');
        if(scripttag.dataset.debugging) {
            Debugging = true;
            ApparatusViewer.debug();
        }

        const recordcontainer = document.getElementById('recordcontainer');
        Transliterate$1.init(recordcontainer);

        for(const t of recordcontainer.querySelectorAll('.teitext > div > div:first-child')) {
            //tamilize(t);
            for(const b of t.querySelectorAll('ruby br')) {
                b.parentElement.after(b.nextSibling);
                b.parentElement.after(b);
            }
        }
        recordcontainer.querySelector('.teitext').addEventListener('click',lookup);
        
        if(document.querySelector('.standOff[data-type="wordsplit"]')) {
            const wordsplitbutton = document.getElementById('wordsplitbutton');
            wordsplitbutton.style.display = 'block';
            wordsplitbutton.addEventListener('click',wordsplit);
        }
        else if(Debugging) {
            const wordsplitbutton = document.getElementById('wordsplitbutton');
            wordsplitbutton.style.display = 'block';
            wordsplitbutton.style.border = '1px dashed grey';
            wordsplitbutton.dataset.anno = 'add word splits';
            wordsplitbutton.querySelector('svg').style.stroke = 'grey';
            const uploader = document.createElement('input');
            uploader.type = 'file';
            uploader.addEventListener('change',addwordsplit);
            wordsplitbutton.addEventListener('click',() => {uploader.click();});
        }
        

        const lineview = document.querySelector('.line-view-icon');

        if(document.querySelector('.translation')) {
            const apparatusbutton = document.getElementById('apparatusbutton');
            apparatusbutton.style.display = 'block';
            apparatusbutton.addEventListener('click',apparatusswitch);
        }
        else {
            for(const app of document.querySelectorAll('.apparatus-block'))
                app.style.display = 'block';
        }
        //wordsplit({target: analyzebutton});
        //cleanup(document);
        
        lineview.style.display = 'none';

        if(document.querySelector('.app')) {
            ApparatusViewer.init();
            ApparatusViewer.setTransliterator(Transliterate$1);
        }

        GitHubFunctions.latestCommits();
    };

    window.addEventListener('load',go);

})();
