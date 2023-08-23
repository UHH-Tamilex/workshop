# Commonly used TEI XML tags


## text structure

#### `<body></body>`

the text body. This usually wraps all of your text.


#### `<lg></lg>`

a "line group", i.e., a poem. Use the `@xml:id` or `@corresp` attributes to give the poem a canonical identifier. For example:
	
	<lg xml:id="AN4">....</lg>
identifies the poem as `AN4`. Alternatively:

	<lg corresp="#AN4">...</lg>
identifies the poem as corresponding to `AN4`. For example, it may be that the poem appears as a quotation embedded in another text. A poem or a verse may have multiple identfiers, if it is reused in multiple texts.


#### `<l></l>`

a "line", i.e., a line in a poem, usually used within the `<lg></lg>` tag.


#### `<p></p>`

a "paragraph", or prose passage (for example, the _kiḷavi_). See `<lg></lg>` above for the use of the `@xml:id` and `@corresp` attributes.


## document structure

#### `<milestone/>`

Used to mark where the transcription begins. Examples:

	 <milestone unit="folio" n="2v"/>
	
The transcription begins at the folio 2 verso.
	
	<milestone unit="page" n="5" facs="6"/>
	
The transcription begins at page 5, and it corresponds to image number 6.
 
#### `<pb/>`

"page beginning". Use the attribute `@n` to denote either the page number. For example:

	<pb n="2"/>
marks the beginning of page 2. Use the `@facs` attribute to denote the image number of that page. For example:
	
	<pb n="6r"  facs="12"/>
marks the beginning of folio 6 recto, which corresponds to image number 12.


#### `<lb/>`

"line beginning". Use the attribute `@n` to denote the line number, e.g., `<lb n="1"/>` for line 1.


#### `<cb/>`

"column beginning". Use the attribute `@n` to denote the column number. Only used when the document is formatted in columns.


## diplomatic transcription

#### `<gap/>`

marks a place where the text is unreadable, for various reasons. Examples:
	
	<gap reason="lost"/>
denotes that an unknown quantity of text has been lost due to damage.

	<gap reason="illegible" quantity="2" unit="character"/>
denotes that two characters are illegible.


#### `<unclear></unclear>`

marks a reading that is not clear, for various reasons. Examples:

		puka<unclear>kku</unclear>
indicates that the character `kku` is unclear, without a stated reason.

		veḷi<unclear reason="vowel_unclear">yā</unclear>
indicates that the `ā` vowel in the character `yā` is unclear. 


#### `<sic></sic>`

marks a reading that has been transcribed as is, even if it seems to be an error. This is **very useful** when proofreading your own transcriptions, to remind yourself that you haven't made a typo. Example:
	
		ha<sic>ra</sic> ōm
		

#### `<add></add>`

marks words or characters that have been added. Use `@place` to indicate where the addition is made.

	na<add place="above">n</add>ti
indicates that `n` has been added above the line.


#### `<del></del>`

marks words or characters that have been deleted. Use `@rend` to indicate how the deletion has been marked.

	<del rend="strikethrough">vērakam</del>
indicates that `vērakam` has been crossed out.


#### `<subst></subst>`

marks a substitution. It is usually used with `<add></add>` and `<del></del>`. Examples: 

	vāma<subst><del rend="overwritten">ṇa</del><add>ṉa</add></subst>
indicates that `ṇa` has been overwritten with `ṉa`.

	cupaṭ<subst><del><gap reason="illegible" quantity="1" unit="character"/></del><add>ca</add></subst>m
indicates that an illegible character has been overwritten with `ca`.

	<subst>h<add place="above">ā</add><del rend="implied">a</del></subst>
indicates that an `ā` sign has been added above the character `ha`, and thus the inherent `a` vowel has been implicitly deleted.
