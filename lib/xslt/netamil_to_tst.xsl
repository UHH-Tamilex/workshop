<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns="http://www.tei-c.org/ns/1.0"
                >
<xsl:output method="xml" indent="yes" encoding="UTF-8" omit-xml-declaration="no"/>

<xsl:template match="/">
    <xsl:processing-instruction name="xml-stylesheet">href="tei-to-html.xsl"</xsl:processing-instruction>
    <xsl:apply-templates/>
</xsl:template>

<xsl:template match="mycoreobject">
    <TEI xmlns="http://www.tei-c.org/ns/1.0">
       <teiHeader>
          <fileDesc>
             <titleStmt>
                <title><xsl:apply-templates select="metadata/titles/title"/></title>
             </titleStmt>
             <editionStmt>
                <p></p>
             </editionStmt>
             <publicationStmt>
                <publisher>TST Project</publisher>
                <date>2021</date>
             </publicationStmt>
             <sourceDesc>
                <msDesc>
                   <msIdentifier>
                      <repository>
                         <orgName>Bibliothèque nationale de France. Département des Manuscrits</orgName>
                      </repository>
                      <idno type="shelfmark"><xsl:apply-templates select="metadata/shelfmarks/shelfmark"/></idno>
                      <idno type="alternate"></idno>
                   </msIdentifier>
                   <msContents>
                      <xsl:attribute name="class">
                        <xsl:text>#</xsl:text>
                        <xsl:value-of select="metadata/rbcontents/rbcontent/@categid"/>
                      </xsl:attribute>
                      <summary>
                        <xsl:apply-templates select="metadata/contents/content/content"/>
                        <xsl:apply-templates select="metadata/contents/content/comment"/>
                      </summary>
                      <xsl:apply-templates select="metadata/contents/content"/>
                   </msContents>
                   <physDesc>
                      <objectDesc>
                         <xsl:attribute name="form">
                            <xsl:variable name="form" select="metadata/formats/format/@categid"/>
                            <xsl:choose>
                                <xsl:when test="$form = 'Form001'">
                                    <xsl:text>pothi</xsl:text>
                                </xsl:when>
                                <xsl:otherwise/>
                            </xsl:choose>
                         </xsl:attribute>
                         <supportDesc>
                            <xsl:attribute name="material">
                                <xsl:variable name="mat" select="metadata/materials/material/@categid"/>
                                <xsl:choose>
                                    <xsl:when test="$mat = 'Mat001'">
                                        <xsl:text>palm-leaf</xsl:text>
                                    </xsl:when>
                                    <xsl:otherwise/>
                                </xsl:choose>
                            </xsl:attribute>
                            <support>
                               <p>
                                 <xsl:apply-templates select="metadata/inks/ink"/>
                               </p>
                            </support>
                            <extent>
                               <measure unit="folio">
                                <xsl:attribute name="quantity">
                                    <xsl:value-of select="substring-before(metadata/folios/folio,'.')"/>
                                </xsl:attribute>
                               </measure>
                               <dimensions type="leaf" unit="mm">
                                  <width>
                                    <xsl:attribute name="quantity">
                                        <xsl:value-of select="metadata/wsizes/wsize * 10"/>
                                    </xsl:attribute>
                                  </width>
                                  <height>
                                    <xsl:attribute name="quantity">
                                        <xsl:value-of select="metadata/hsizes/hsize * 10"/>
                                    </xsl:attribute>
                                  </height>
                               </dimensions>
                            </extent>
                            <collation></collation>
                            <foliation>
                                <xsl:apply-templates select="metadata/dcomments/dcomment"/>
                            </foliation>
                            <condition>
                                <xsl:apply-templates select="metadata/states/state"/>
                            </condition>
                         </supportDesc>
                         <layoutDesc>
                            <layout columns="">
                                <xsl:attribute name="writtenLines">
                                    <xsl:variable name="min" select="metadata/flines/fline"/>
                                    <xsl:variable name="max" select="metadata/tlines/tline"/>
                                    <xsl:value-of select="concat(substring-before($min,'.'), ' ', substring-before($max,'.'))"/>
                                </xsl:attribute>
                            </layout>
                         </layoutDesc>
                      </objectDesc>
                      <handDesc><handNote n="" scope="" script=""><desc></desc></handNote></handDesc>
                      <decoDesc><decoNote type=""><desc></desc></decoNote>
                      </decoDesc>
                      <additions>
                        <xsl:apply-templates select="metadata/marginals/marginal"/>
                        <xsl:apply-templates select="metadata/invocations/invocation"/>
                        <xsl:apply-templates select="metadata/annotations/annotation"/>
                        <xsl:apply-templates select="metadata/pcomments/pcomment"/>
                      </additions>
                      <bindingDesc>
                         <binding>
                           <p>
                             <xsl:variable name="cover" select="metadata/covers/cover/@categid"/>
                             <xsl:choose>
                                <xsl:when test="$cover = 'Cover001'">
                                    <xsl:text>Wood covers.</xsl:text>
                                </xsl:when>
                                <xsl:otherwise/>
                             </xsl:choose>
                           </p>
                         </binding>
                      </bindingDesc>
                   </physDesc>
                   <history>
                      <origin>
                         <origDate calendar="gregorian" when="">
                            <xsl:apply-templates select="metadata/txdates/txdate"/>
                         </origDate>
                         <origPlace>
                            <xsl:apply-templates select="metadata/colplaces/colplace"/>
                         </origPlace>
                      </origin>
                      <provenance>
                            <xsl:apply-templates select="metadata/colpersons/colperson"/>
                      </provenance>
                      <acquisition>
                            <xsl:apply-templates select="metadata/prowners/prowner"/>
                      </acquisition>
                   </history>
                   <additional>
                      <listBibl>
                        <xsl:apply-templates select="metadata/catalogues/catalogue"/>
                        <xsl:apply-templates select="metadata/editions/edition"/>
                        <xsl:apply-templates select="metadata/literatures/literature"/>
                      </listBibl>
                   </additional>
                </msDesc>
             </sourceDesc>
          </fileDesc>
          <encodingDesc>
             <p></p>
          </encodingDesc>
          <revisionDesc>
             <xsl:apply-templates select="service/servdates/servdate"/>
          </revisionDesc>
       </teiHeader>
       <facsimile>
       </facsimile>
    </TEI>
</xsl:template>

<xsl:template match="shelfmark">
    <xsl:apply-templates/>
</xsl:template>

<xsl:template match="contents/content/content">
    <p><xsl:apply-templates/></p>
</xsl:template>
<xsl:template match="contents/content/comment">
    <p><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="contents/content">
    <msItem>
        <xsl:attribute name="defective">
            <xsl:variable name="clstate" select="//clstates/clstate/@categid"/>
            <xsl:choose>
                <xsl:when test="$clstate = 'State001'">
                    <xsl:text>false</xsl:text>
                </xsl:when>
                <xsl:otherwise><xsl:text>true</xsl:text></xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>
        <xsl:apply-templates select="titles/title"/>
        <xsl:apply-templates select="authors/author"/>
        <xsl:apply-templates select="commentators/commentator"/>
     <textLang mainLang="tam"/>
     <filiation>
        <p></p>
     </filiation>
     <rubric xml:lang="tam"></rubric>
     <xsl:apply-templates select="begin"/>
     <xsl:apply-templates select="end"/>
     <finalRubric xml:lang="tam"></finalRubric>
     <xsl:apply-templates select="colophon"/>
    </msItem>
</xsl:template>
<xsl:template match="title">
    <title xml:lang="tam">
        <xsl:apply-templates/>
    </title>
</xsl:template>
<xsl:template match="author">
    <author xml:lang="tam">
        <xsl:apply-templates/>
    </author>
</xsl:template>
<xsl:template match="commentator">
    <author xml:lang="tam" type="commentator">
        <xsl:apply-templates/>
    </author>
</xsl:template>
<xsl:template match="begin">
    <incipit xml:lang="tam"><xsl:apply-templates/></incipit>
</xsl:template>
<xsl:template match="end">
    <explicit xml:lang="tam"><xsl:apply-templates/></explicit>
</xsl:template>
<xsl:template match="colophon">
    <colophon xml:lang="tam"><xsl:apply-templates/></colophon>
</xsl:template>
<xsl:template match="marginal">
    <desc type="intertitle" subtype="marginal">
        <xsl:apply-templates/>
    </desc>
</xsl:template>
<xsl:template match="invocation">
    <desc type="benediction">
        <xsl:apply-templates/>
    </desc>
</xsl:template>
<xsl:template match="annotation">
    <desc type="annotation">
        <xsl:apply-templates/>
    </desc>
</xsl:template>
<xsl:template match="pcomment">
    <desc>
        <xsl:apply-templates/>
    </desc>
</xsl:template>

<xsl:template match="catalogue | edition | literature">
    <bibl><xsl:apply-templates/></bibl>
</xsl:template>

<xsl:template match="servdate">
    <change>
        <xsl:attribute name="change">
            <xsl:value-of select="substring(.,1,7)"/>
        </xsl:attribute>
        <xsl:choose>
            <xsl:when test="@type='modifydate'">
                <xsl:value-of select="//servflags/servflag[@type='modifiedby']"/>
            </xsl:when>
            <xsl:when test="@type='createdate'">
                <xsl:value-of select="//servflags/servflag[@type='createdby']"/>
            </xsl:when>
            <xsl:otherwise/>
        </xsl:choose>
    </change>
</xsl:template>

</xsl:stylesheet>
