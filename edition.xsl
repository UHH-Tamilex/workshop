<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:exsl="http://exslt.org/common"
                xmlns:x="http://www.tei-c.org/ns/1.0"
                xmlns:tst="https://github.com/tst-project"
                exclude-result-prefixes="x tst">

<xsl:import href="lib/xslt/copy.xsl"/>
<xsl:import href="lib/xslt/functions.xsl"/>
<xsl:import href="lib/xslt/definitions.xsl"/>
<xsl:import href="lib/xslt/common.xsl"/>
<xsl:import href="lib/xslt/teiheader.xsl"/>
<xsl:import href="lib/xslt/transcription.xsl"/>
<xsl:import href="lib/xslt/apparatus.xsl"/>

<xsl:output method="html" encoding="UTF-8" omit-xml-declaration="yes" indent="no"/>

<xsl:param name="root">./lib/</xsl:param>
<xsl:param name="debugging">false</xsl:param>

<xsl:template match="x:TEI">
    <xsl:call-template name="TEI"/>
</xsl:template>

<xsl:template name="TEI">
    <xsl:element name="html">
        <xsl:element name="head">
            <xsl:element name="meta">
                <xsl:attribute name="charset">utf-8</xsl:attribute>
            </xsl:element>
            <xsl:element name="meta">
                <xsl:attribute name="name">viewport</xsl:attribute>
                <xsl:attribute name="content">width=device-width,initial-scale=1</xsl:attribute>
            </xsl:element>
            <xsl:element name="title">
                <xsl:value-of select="//x:titleStmt/x:title"/>
            </xsl:element>
            <xsl:element name="link">
                <xsl:attribute name="rel">icon</xsl:attribute>
                <xsl:attribute name="type">image/png</xsl:attribute>
                <xsl:attribute name="href">lib/img/favicon-32.png</xsl:attribute>
            </xsl:element>
            <xsl:element name="link">
                <xsl:attribute name="rel">stylesheet</xsl:attribute>
                <xsl:attribute name="href"><xsl:value-of select="$root"/>css/tufte.css</xsl:attribute>
            </xsl:element>
            <xsl:element name="link">
                <xsl:attribute name="rel">stylesheet</xsl:attribute>
                <xsl:attribute name="href"><xsl:value-of select="$root"/>css/fonts.css</xsl:attribute>
            </xsl:element>
            <xsl:element name="link">
                <xsl:attribute name="rel">stylesheet</xsl:attribute>
                <xsl:attribute name="href"><xsl:value-of select="$root"/>css/tst.css</xsl:attribute>
            </xsl:element>
            <xsl:element name="link">
                <xsl:attribute name="rel">stylesheet</xsl:attribute>
                <xsl:attribute name="href"><xsl:value-of select="$root"/>css/header.css</xsl:attribute>
            </xsl:element>
            <xsl:element name="link">
                <xsl:attribute name="rel">stylesheet</xsl:attribute>
                <xsl:attribute name="href"><xsl:value-of select="$root"/>css/transcription.css</xsl:attribute>
            </xsl:element>
            <xsl:element name="link">
                <xsl:attribute name="rel">stylesheet</xsl:attribute>
                <xsl:attribute name="href"><xsl:value-of select="$root"/>css/apparatus.css</xsl:attribute>
            </xsl:element>
            <xsl:if test="$debugging = 'true'">
                <xsl:element name="link">
                    <xsl:attribute name="rel">stylesheet</xsl:attribute>
                    <xsl:attribute name="href">debugging/prism.css</xsl:attribute>
                </xsl:element>
            </xsl:if>
            <xsl:element name="link">
                <xsl:attribute name="rel">stylesheet</xsl:attribute>
                <xsl:attribute name="href">edition.css</xsl:attribute>
            </xsl:element>
            <xsl:element name="style">
                <xsl:text>
                </xsl:text>
            </xsl:element>
            <xsl:if test="$debugging = 'true'">
                <xsl:element name="script">
                    <xsl:attribute name="src">debugging/papaparse.min.js</xsl:attribute>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$debugging = 'true'">
                <xsl:element name="script">
                    <xsl:attribute name="src">debugging/prism.js</xsl:attribute>
                    <xsl:attribute name="data-manual"/>
                </xsl:element>
            </xsl:if>
            <xsl:element name="script">
                <xsl:attribute name="src">edition-min.js</xsl:attribute>
                <xsl:attribute name="id">editionscript</xsl:attribute>
                <xsl:if test="$debugging = 'true'">
                    <xsl:attribute name="data-debugging">true</xsl:attribute>
                </xsl:if>
            </xsl:element>
        </xsl:element>
        <xsl:element name="body">
            <xsl:attribute name="lang">en</xsl:attribute>   
            <xsl:element name="div">
                <xsl:attribute name="id">recordcontainer</xsl:attribute>
                <xsl:element name="div">
                    <xsl:choose>
                        <xsl:when test="x:facsimile/x:graphic">
                            <xsl:attribute name="id">record-thin</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="id">record-fat</xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:element name="div">
                        <xsl:attribute name="id">topbar</xsl:attribute>
                        <xsl:element name="div">
                            <xsl:attribute name="id">transbutton</xsl:attribute>
                            <xsl:attribute name="data-anno">change script</xsl:attribute>
                            <xsl:text>A</xsl:text>
                        </xsl:element>
                        <xsl:element name="div">
                            <xsl:attribute name="id">wordsplitbutton</xsl:attribute>
                            <xsl:attribute name="data-anno">word-split text</xsl:attribute>
<svg id="wordsplitsvg" width="22" height="22" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M2.207 8h3.772v1h-3.772l1.646 1.646-0.707 0.707-2.853-2.853 2.854-2.854 0.707 0.707-1.647 1.647zM13.854 5.646l-0.707 0.707 1.646 1.647h-3.772v1h3.772l-1.646 1.646 0.707 0.707 2.853-2.853-2.853-2.854zM8 17h1v-17h-1v17z" fill="#000000" /></svg>
<svg id="metricalsvg" width="22" height="22" version="1.1" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg"><a><path d="m3.059 5.646-0.707 0.707 1.646 1.647h-3.772v1h3.772l-1.646 1.646 0.707 0.707 2.853-2.853zm4.941 11.354h1v-17h-1z"/></a><path d="m13.018 7.9969h3.772v1h-3.772l1.646 1.646-0.707 0.707-2.853-2.853 2.854-2.854 0.707 0.707z"/></svg>
                        </xsl:element>
                        <xsl:element name="div">
                            <xsl:attribute name="id">apparatusbutton</xsl:attribute>
                            <xsl:attribute name="data-anno">apparatus of variants</xsl:attribute>
<svg id="apparatussvg" width="22" height="21" fill="#000000" version="1.1" viewBox="0 0 381.66 415.46" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#000"><path d="m10.395 208.37c2.6785-185.49 346.77-166.49 346.77-166.49" stroke-width="20.48px"/><path d="m10.239 206.9c2.6785 185.49 346.77 166.49 346.77 166.49" stroke-width="20.48px"/><path d="m14.182 210.85 315.07 0.84841" stroke-width="20.581px"/><g stroke-width="21.098px"><path d="m287.4 179.06 54.215 32.066-51.981 34.443"/><path d="m307.59 9.0797 54.215 32.066-51.981 34.443"/><path d="m305.3 340.15 54.215 32.066-51.981 34.443"/></g></g></svg>
<svg id="translationsvg" width="22" height="21" fill="#000000" version="1.1" viewBox="0 0 381.66 415.46" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#000" stroke-width="22.641px"><path d="m-0.58397 41.896h381.87"/><path d="m-0.58397 205.74h381.87"/><path d="m-0.58397 369.58h381.87"/></g></svg>
                        </xsl:element>
                    </xsl:element>
                    <xsl:element name="article">
                        <xsl:apply-templates/>
                    </xsl:element>
                </xsl:element>
            </xsl:element>
            <xsl:variable name="manifest" select="x:facsimile/x:graphic/@url"/>
            <xsl:if test="$manifest">
                <xsl:element name="div">
                    <xsl:attribute name="id">viewer</xsl:attribute>
                    <xsl:attribute name="data-manifest">
                        <xsl:value-of select="$manifest"/>
                    </xsl:attribute>
                    <xsl:variable name="start" select="x:facsimile/x:graphic/@facs"/>
                    <xsl:attribute name="data-start">
                        <xsl:choose>
                            <xsl:when test="$start"><xsl:value-of select="$start - 1"/></xsl:when>
                            <xsl:otherwise>0</xsl:otherwise>
                        </xsl:choose>
                    </xsl:attribute>
                </xsl:element>
            </xsl:if>
        </xsl:element>
    </xsl:element>
</xsl:template>

<xsl:template match="x:text/x:body/x:div">
    <xsl:element name="div">
        <xsl:attribute name="class">lg wide</xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:if test="@xml:id">
            <xsl:attribute name="id"><xsl:value-of select="@xml:id"/></xsl:attribute>
        </xsl:if>
        <xsl:apply-templates/>
        <xsl:variable name="id"><xsl:text>#</xsl:text><xsl:value-of select="@xml:id"/></xsl:variable>
        <xsl:variable name="apparatus" select="//x:standOff[@type='apparatus' and @corresp=$id]"/>
        <xsl:if test="$apparatus">
            <xsl:call-template name="apparatus">
                <xsl:with-param name="apparatus" select="$apparatus"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:element>
</xsl:template>
<xsl:template match="x:div/x:p">
    <xsl:element name="div">
        <xsl:attribute name="class">
            <xsl:text>text-block </xsl:text>
            <xsl:choose>
                <xsl:when test="@type='edition'"><xsl:text>edition</xsl:text></xsl:when>
                <xsl:when test="@type='translation'"><xsl:text>translation</xsl:text></xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:div/x:lg">
    <xsl:element name="div">
        <xsl:attribute name="class">
            <xsl:text>text-block </xsl:text>
            <xsl:choose>
                <xsl:when test="@type='edition'"><xsl:text>edition</xsl:text></xsl:when>
                <xsl:when test="@type='translation'"><xsl:text>translation</xsl:text></xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates select="x:l"/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:l">
    <xsl:element name="div">
        <xsl:attribute name="class">
            <xsl:text>l</xsl:text>
            <xsl:if test="@rend">
                <xsl:text> </xsl:text>
                <xsl:value-of select="@rend"/>
            </xsl:if>
        </xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
        <xsl:text>
</xsl:text>
    </xsl:element>
</xsl:template>
<xsl:template match="x:choice">
    <xsl:element name="span">
    <xsl:attribute name="class">choice</xsl:attribute>
    <xsl:apply-templates />
    </xsl:element>
</xsl:template>
<xsl:template match="x:seg">
    <xsl:element name="span">
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template match="x:standOff">
    <xsl:element name="div">
        <xsl:attribute name="class">standOff</xsl:attribute>
        <xsl:attribute name="data-corresp"><xsl:value-of select="@corresp"/></xsl:attribute>
        <xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:entry">
    <xsl:element name="div">
        <xsl:attribute name="class">fs</xsl:attribute>
        <xsl:attribute name="data-corresp"><xsl:value-of select="@corresp"/></xsl:attribute>
        <xsl:if test="@select">
            <xsl:attribute name="data-select"><xsl:value-of select="@select"/></xsl:attribute>
        </xsl:if>
        <xsl:if test="@rend='none'">
            <xsl:attribute name="data-rend">none</xsl:attribute>
        </xsl:if>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:form">
    <xsl:element name="div">
        <xsl:attribute name="class">f</xsl:attribute>
        <xsl:attribute name="data-name">lemma</xsl:attribute>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:def">
    <xsl:element name="div">
        <xsl:attribute name="class">f</xsl:attribute>
        <xsl:attribute name="data-name">translation</xsl:attribute>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template match="x:standOff[@type='apparatus']"/>

<xsl:template name="apparatus">
    <xsl:param name="apparatus"/>
    <xsl:element name="div">
        <xsl:attribute name="class">apparatus-block</xsl:attribute>
        <xsl:attribute name="style">display: none;</xsl:attribute>
    <xsl:call-template name="inline-apparatus"/>
    <xsl:apply-templates select="$apparatus/x:listApp"/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:standOff/x:listApp">
    <xsl:for-each select="x:app">
        <xsl:call-template name="app"/>
    </xsl:for-each>
</xsl:template>

<xsl:template name="inline-apparatus">
    <xsl:for-each select=".//x:app">
        <span class="app">
            <xsl:choose>
                <xsl:when test="x:lem">
                    <xsl:call-template name="lemma"/>
                </xsl:when>
                <xsl:otherwise>
                    <span class="lem lem-anchor">†</span>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:if test="x:rdg">
                <span>
                    <xsl:for-each select="x:rdg">
                        <xsl:call-template name="reading"/>
                    </xsl:for-each>
                </span>
            </xsl:if>
            <xsl:for-each select="x:note">
                <xsl:text> </xsl:text>
                <xsl:apply-templates select="."/>
            </xsl:for-each>
        </span>
        <xsl:text> </xsl:text>
    </xsl:for-each>
</xsl:template>

<xsl:template name="app">
    <xsl:element name="span">
        <xsl:attribute name="class">app</xsl:attribute>
        <xsl:choose>
            <xsl:when test="x:lem">
                <xsl:call-template name="lemma"/>
            </xsl:when>
            <xsl:otherwise>
                <span class="lem lem-anchor">†</span>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:if test="x:rdg">
            <span>
                <xsl:for-each select="x:rdg">
                    <xsl:call-template name="reading"/>
                </xsl:for-each>
            </span>
        </xsl:if>
        <xsl:for-each select="x:note">
            <xsl:text> </xsl:text>
            <xsl:apply-templates select="."/>
        </xsl:for-each>
    </xsl:element>
    <xsl:text> </xsl:text>
</xsl:template>
<xsl:template name="lemma">
    <!--xsl:variable name="corresp" select="ancestor::*[@corresp]/@corresp"/-->
    <xsl:if test="$debugging = 'true'">
        <xsl:element name="span">
            <xsl:attribute name="class">lemmalookup</xsl:attribute>
            <xsl:attribute name="data-anno">find lemma in the text</xsl:attribute>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12"><g stroke-width="2" stroke="#6c6c6c" fill="none"><path d="M11.29 11.71l-4-4"/><circle cx="5" cy="5" r="4"/></g></svg>
        </xsl:element>
    </xsl:if>
    <xsl:element name="span">
        <xsl:attribute name="class">lem</xsl:attribute>
        <xsl:attribute name="data-corresp"><xsl:value-of select="@corresp"/></xsl:attribute>
        <xsl:attribute name="data-text"><xsl:value-of select="x:lem/text()"/></xsl:attribute>
        <xsl:apply-templates select="x:lem/node()"/>
    </xsl:element>
    <xsl:if test="x:lem/@wit">
        <span>
            <xsl:attribute name="class">lem-wit</xsl:attribute>
            <xsl:call-template name="splitwit">
                <xsl:with-param name="mss" select="x:lem/@wit"/>
                <!--xsl:with-param name="corresp" select="$corresp"/-->
            </xsl:call-template>
        </span>
    </xsl:if>
    <xsl:text> </xsl:text>
</xsl:template>

<xsl:template name="reading">
    <!--xsl:variable name="corresp" select="ancestor::*[@corresp]/@corresp"/-->
    <span>
        <xsl:attribute name="class">rdg</xsl:attribute>
        <span>
            <xsl:attribute name="class">rdg-text</xsl:attribute>
            <xsl:choose>
                <xsl:when test="./node()">
                    <xsl:apply-templates select="./node()"/>
                </xsl:when>
                <xsl:otherwise>
                    <span lang="en">[om.]</span>
                </xsl:otherwise>
            </xsl:choose>
        </span>
        <xsl:text> </xsl:text>
        <span>
            <xsl:attribute name="class">rdg-wit</xsl:attribute>
            <xsl:call-template name="splitwit">
                <!--xsl:with-param name="corresp" select="$corresp"/-->
            </xsl:call-template>
        </span>
    </span>
    <xsl:text> </xsl:text>
</xsl:template>
<xsl:template match="x:lg">
    <xsl:element name="div">
        <xsl:attribute name="class">lg</xsl:attribute>
        <xsl:if test="@corresp">
            <xsl:attribute name="data-corresp"><xsl:value-of select="@corresp"/></xsl:attribute>
        </xsl:if>
        <xsl:if test="@met">
            <xsl:attribute name="data-anno"><xsl:value-of select="@met"/></xsl:attribute>
        </xsl:if>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates select="x:l"/>
    </xsl:element>
</xsl:template>

</xsl:stylesheet>
