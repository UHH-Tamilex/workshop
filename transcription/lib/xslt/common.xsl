<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:x="http://www.tei-c.org/ns/1.0"
                xmlns:tst="https://github.com/tst-project"
                exclude-result-prefixes="x tst">

<xsl:output method="html" encoding="UTF-8" omit-xml-declaration="yes"/>

<xsl:template match="x:div1">
    <xsl:element name="section">
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:div2">
    <xsl:element name="section">
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:div3">
    <xsl:element name="section">
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template match="x:div1/x:head">
    <xsl:element name="h2">
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:div2/x:head">
    <xsl:element name="h3">
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:div3/x:head">
    <xsl:element name="h4">
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template name="p">
    <xsl:element name="p">
        <xsl:if test="@corresp">
            <xsl:attribute name="data-corresp"><xsl:value-of select="@corresp"/></xsl:attribute>
        </xsl:if>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:p">
    <xsl:call-template name="p"/>
</xsl:template>

<xsl:template match="x:list">
    <xsl:element name="ul">
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:list[@rend='numbered']">
    <xsl:element name="ol">
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:item">
    <xsl:element name="li">
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template match="x:p//x:list">
    <xsl:element name="span">
        <xsl:attribute name="class">list</xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:p//x:list[@rend='numbered']">
    <xsl:element name="span">
        <xsl:attribute name="class">list numbered</xsl:attribute>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:p//x:list/x:item">
    <xsl:element name="span">
        <xsl:attribute name="class">item</xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template match="x:span">
    <xsl:element name="span">
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template match="x:emph">
    <xsl:element name="em">
        <xsl:attribute name="class">
            <xsl:value-of select="@rend"/>
        </xsl:attribute>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template name="lg">
    <xsl:element name="div">
        <xsl:attribute name="class">lg</xsl:attribute>
        <xsl:if test="@corresp">
            <xsl:attribute name="data-corresp"><xsl:value-of select="@corresp"/></xsl:attribute>
        </xsl:if>
        <xsl:if test="@met">
            <xsl:attribute name="data-anno"><xsl:value-of select="@met"/></xsl:attribute>
        </xsl:if>
        <xsl:call-template name="lang"/>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>
<xsl:template match="x:lg">
    <xsl:call-template name="lg"/>
</xsl:template>

<xsl:template match="x:l">
    <xsl:element name="div">
        <xsl:call-template name="lang"/>
        <xsl:attribute name="class">l</xsl:attribute>
        <xsl:apply-templates/>
    </xsl:element>
</xsl:template>

<xsl:template match="x:date">
    <xsl:apply-templates/>
</xsl:template>

<xsl:template match="x:publisher">
    <xsl:apply-templates/>
</xsl:template>

</xsl:stylesheet>
