"""Small, text-free SVG diagrams embedded alongside the book's main explanations."""
from pathlib import Path
from html import escape
import math

NAVY='#123d59'; RED='#a55239'; GRAY='#8c918b'; PAPER='#faf7f0'
EXAMPLE_IDS={1,3,9,18,20,22,24,25,35,36,44,49,54,57,58,60,64,69,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100}

def icon(kind,x,y,s=1,color=NAVY):
    if kind == 'person':
        return ''
    shapes={
    'eye':'<path d="M-35 0Q0 -35 35 0Q0 35 -35 0Z"/><circle r="11"/>',
    'network':'<circle cx="0" cy="-22" r="9"/><circle cx="-25" cy="21" r="9"/><circle cx="25" cy="21" r="9"/><path d="M-5 -13L-20 13M5 -13L20 13M-16 21H16"/>',
    'badge':'<rect x="-27" y="-22" width="54" height="46" rx="5"/><circle cx="-10" cy="0" r="9"/><path d="M8 -8H18M8 2H18M8 12H18"/>',
    'clock':'<circle r="27"/><path d="M0 -19V0L15 9M0 -27V-23M27 0H23M0 27V23M-27 0H-23"/>',
    'coin':'<ellipse cy="-10" rx="25" ry="9"/><path d="M-25 -10V14C-25 26 25 26 25 14V-10M-25 1C-25 13 25 13 25 1M-25 12C-25 24 25 24 25 12"/>',
    'book':'<path d="M0 -20Q-17 -31 -32 -23V22Q-16 14 0 25Q16 14 32 22V-23Q16 -31 0 -20V25"/>',
    'bulb':'<path d="M-13 15C-40 -13 -15 -41 5 -33C30 -27 34 -5 14 15V27H-13ZM-13 21H14M-9 34H10M0 -49V-57M-36 -35L-43 -41M36 -35L43 -41"/>',
    'target':'<circle r="29"/><circle r="18"/><circle r="6"/>',
    'shield':'<path d="M0 -32L27 -22V1Q24 23 0 34Q-24 23 -27 1V-22ZM-13 -1L-2 10 16 -12"/>',
    'heart':'<path d="M0 27C-67 -12 -20 -46 0 -19C20 -46 67 -12 0 27Z"/>',
    'tools':'<path d="M-22 -30L-6 -14 6 -26Q28 -22 26 -4L13 1 -12 31 -26 17 -1 -10Z"/>',
    'check':'<rect x="-26" y="-26" width="52" height="52" rx="5"/><path d="M-15 0L-3 12 17 -13"/>',
    'ear':'<path d="M-14 27C-1 36 13 25 11 12C8 2 29 -3 23 -20C15 -44 -18 -37 -22 -14M-10 -9C-8 -25 12 -24 12 -10C12 2 -3 -2 -1 11"/>',
    'sun':'<circle r="18"/><path d="M0 -31V-40M0 31V40M31 0H40M-31 0H-40M23 23L30 30M-23 -23L-30 -30M23 -23L30 -30M-23 23L-30 30"/>',
    'cloud':'<path d="M-28 15C-53 13 -39 -20 -20 -13C-13 -43 24 -39 29 -15C56 -15 51 18 28 18H-28ZM-20 29L-26 43M0 29L-6 43M20 29L14 43"/>',
    'plant':'<path d="M0 31V-5M0 12C-29 15 -36 -10 -31 -23C-5 -22 1 -8 0 12ZM0 -3C-3 -24 14 -33 31 -30C34 -10 20 0 0 -3ZM-23 33H23L17 55H-17Z"/>',
    'box':'<path d="M-28 -15L0 -29 28 -15V19L0 34 -28 19ZM-28 -15L0 0 28 -15M0 0V34"/>',
    'bell':'<path d="M-26 18H26C13 3 25 -23 0 -26C-25 -23 -13 3 -26 18ZM-9 26Q0 37 9 26M0 -26V-34"/>',
    'star':'<path d="M0 -32L10 -10 34 -9 15 7 21 31 0 18 -21 31 -15 7 -34 -9 -10 -10Z"/>',
    'flag':'<path d="M-18 34V-32Q2 -45 23 -29V1Q3 -14 -18 -1"/>',
    'pin':'<path d="M0 35C-58 -28 -3 -51 19 -29C41 -6 6 26 0 35Z"/><circle cy="-13" r="9"/>',
    'mail':'<rect x="-31" y="-21" width="62" height="44" rx="4"/><path d="M-29 -18L0 5 29 -18"/>',
    'magnify':'<circle cx="-6" cy="-8" r="24"/><path d="M12 11L35 35M17 7L40 30"/>',
    'hat':'<path d="M-34 16Q0 29 34 16Q0 3 -34 16ZM-20 11V-22Q0 -34 20 -22V11"/>',
    'lock':'<rect x="-24" y="-4" width="48" height="38" rx="5"/><path d="M-15 -4V-20C-15 -42 15 -42 15 -20V-4"/>',
    'umbrella':'<path d="M-34 0Q0 -48 34 0Q22 -12 12 0Q0 -12 -12 0Q-22 -12 -34 0ZM0 -25V32Q0 47 14 39"/>',
    'cup':'<path d="M-24 -18H22V20Q-1 34 -24 20ZM22 -11C49 -19 48 15 22 11M-28 34H31"/>',
    'fan':'<circle r="29"/><circle r="5"/><path d="M0 -5C-23 -39 27 -34 7 -3M5 2C45 -8 30 36 3 8M-5 3C-18 41 -43 0 -9 -3M0 29V48M-19 48H19"/>',
    'openDoor':'<path d="M-27 33V-34H27V33M-22 28V-28L11 -42V39L-22 28ZM-22 -28H20V28"/><circle cx="3" cy="0" r="2"/>',
    'door':'<path d="M-25 32V-34H25V32ZM-20 28V-29H20V28"/><circle cx="11" cy="0" r="2"/>',
    'bird':'<path d="M-30 13Q-9 -10 7 -15Q27 -29 29 -6L39 -2 28 2Q20 32 -9 22L-30 30 -20 16M-8 0Q0 16 17 5M1 24V34M12 24V34"/>',
    'leaf':'<path d="M-24 24Q-37 -15 26 -30Q39 13 -24 24ZM-24 24L22 -25"/>',
    'gear':'<circle r="28"/><circle r="10"/><path d="M0 -28V-39M20 -20L29 -29M28 0H39M20 20L29 29M0 28V39M-20 20L-29 29M-28 0H-39M-20 -20L-29 -29"/>',
    'bench':'<path d="M-32 -15H32V2H-32ZM-35 10H35M-24 10V32M24 10V32M-24 2V10M24 2V10"/>',
    }
    return f'<g transform="translate({x} {y}) scale({s})" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">{shapes.get(kind,'')}</g>'

def line(x1,y1,x2,y2,color=NAVY,dash=False,arrow=True):
    return f'<path d="M{x1} {y1}L{x2} {y2}" fill="none" stroke="{color}" stroke-width="3"'+(' stroke-dasharray="8 8"' if dash else '')+(' marker-end="url(#arrow)"' if arrow else '')+'/>'
def path(d,color=NAVY,dash=False,arrow=False,width=3):
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}"'+(' stroke-dasharray="8 8"' if dash else '')+(' marker-end="url(#arrow)"' if arrow else '')+'/>'
def circle(x,y,rad=47,color=NAVY,fill=PAPER):
    return f'<circle cx="{x}" cy="{y}" r="{rad}" fill="{fill}" stroke="{color}" stroke-width="2"/>'
def node(kind,x,y,s=1):return circle(x,y,48*s)+icon('box' if kind == 'person' else kind,x,y,.7*s)
def axis(x=100,y=350,w=790,h=260):return line(x,y,x+w,y)+line(x,y,x,y-h)
def loop(kinds):
    coords=[(240,210),(500,88),(760,210),(500,332)]
    out=''
    for i,(x,y) in enumerate(coords):
        nx,ny=coords[(i+1)%4];mx=(x+nx)/2;my=(y+ny)/2
        out+=line(x+(nx-x)*.22,y+(ny-y)*.22,nx-(nx-x)*.22,ny-(ny-y)*.22)
    for (x,y),kind in zip(coords,kinds):out+=node(kind,x,y)
    return out+icon('person',100,230,1.1)

def sign(x,y,negative=False):
    return circle(x,y,17,RED if negative else NAVY,PAPER)+path(f'M{x-8} {y}H{x+8}'+('' if negative else f'M{x} {y-8}V{y+8}'),RED if negative else NAVY,width=2)

def supplemental(n):
    """Explain a detail the narrative opening illustration does not already show."""
    if n==91:
        out=''
        for x,k in [(210,'tools'),(500,'magnify'),(790,'book')]:
            out+=f'<rect x="{x-100}" y="110" width="200" height="220" rx="15" fill="none" stroke="{NAVY if x==210 else GRAY}" stroke-width="2"'+(' stroke-dasharray="7 7"' if x==790 else '')+'/>'+icon(k,x,215,.9)
        return out+line(325,220,385,220,GRAY,True)+line(615,220,675,220,GRAY,True)
    if n==92:
        out=''
        for y,w in [(135,400),(310,650)]:
            out+=f'<rect x="170" y="{y-30}" width="400" height="60" fill="{NAVY}" rx="4"/>'
            out+=f'<rect x="170" y="{y-30}" width="{w}" height="60" fill="none" stroke="{GRAY}" stroke-width="2" rx="4"/>'
            out+=path(f'M{170+w} {y-55}V{y+55}',RED,width=3)
        return out+path('M590 360V380H800V360',GRAY,width=2)
    if n==93:
        out=f'<rect x="235" y="65" width="540" height="310" rx="18" fill="none" stroke="#ded8cd" stroke-width="2"/>'
        for i in range(27):
            x=285+(i%9)*55;y=130+(i//9)*90
            out+=f'<circle cx="{x}" cy="{y}" r="16" fill="{NAVY if i<9 else PAPER}" stroke="{NAVY if i<9 else GRAY}" stroke-width="2"/>'
        return out
    if n==94:
        out=''
        for i in range(20):
            x=230+(i%10)*60;y=150+(i//10)*135
            out+=f'<rect x="{x-18}" y="{y-18}" width="36" height="36" rx="5" fill="{PAPER}" stroke="{RED if i<14 else NAVY}" stroke-width="2"/>'
            if i<14:out+=path(f'M{x-8} {y+8}L{x+8} {y-8}',RED,width=2)
        return out+path('M200 80H800M200 80V105M800 80V105',GRAY,width=2)
    if n==95:
        out=path('M160 110V360H860',GRAY,width=2)
        for x,y,w,c in [(180,135,240,NAVY),(420,135,210,GRAY),(180,280,540,NAVY)]:
            out+=f'<rect x="{x}" y="{y}" width="{w}" height="55" fill="{c}" rx="4"/>'
        return out+path('M630 110V210M720 255V355',RED,True,width=2)
    if n==96:
        out=node('mail',230,120,.8)+node('box',230,320,.8)+node('gear',510,220,.9)+node('target',820,220,.9)
        out+=line(270,130,460,200)+line(270,310,460,240)+line(560,220,765,220)
        out+=icon('tools',510,75,.6)+path('M510 115V165',RED,True,True)
        return out+path('M820 275V380H230V365',GRAY,True,True)
    if n==97:
        coords=[(260,120),(260,320),(580,90),(580,350),(800,220)]
        out=''
        for a,b,dash in [(0,2,False),(0,3,False),(1,3,False),(1,4,False),(2,4,False),(3,4,False),(0,4,True),(1,2,True)]:
            x,y=coords[a];xx,yy=coords[b];out+=line(x,y,xx,yy,GRAY if dash else NAVY,dash,False)
        for i,(x,y) in enumerate(coords):out+=circle(x,y,28,NAVY)+icon('mail' if i<2 else 'box',x,y,.35)
        return out
    if n==98:
        out=node('tools',170,200,.9)+line(220,200,450,200)+node('star',500,200,.9)+line(550,200,780,200)+node('check',830,200,.9)
        out+=path('M830 260V350H170V260',GRAY,True,True)+icon('heart',500,75,.6)
        return out
    if n==99:
        out=path('M165 65H860M165 65V390M165 225H860M515 65V390',GRAY,width=2)
        for x,y,hours in [(220,130,1),(570,130,3),(220,300,4),(570,300,5)]:
            for i in range(hours):out+=f'<rect x="{x+i*48}" y="{y}" width="30" height="40" fill="{NAVY}" rx="3"/>'
        return out
    if n==100:
        out=''
        for y,book_w,phone_w in [(125,290,150),(310,150,290)]:
            out+=icon('book',145,y,.65)+icon('mail',585,y,.65)
            out+=f'<rect x="205" y="{y-22}" width="{book_w}" height="44" fill="{NAVY}" rx="4"/><rect x="645" y="{y-22}" width="{phone_w}" height="44" fill="{GRAY}" rx="4"/>'
        return out+path('M95 65H935M95 65V90M935 65V90',GRAY,width=2)
    if n==88:
        out=''
        for i,k in enumerate(['eye','heart','plant','mail']):
            x=170+i*220
            out+=node(k,x,200,.9)
            if i<3:out+=line(x+48,200,x+165,200)
        return out+path('M830 265V345H170V265',GRAY,True,True)
    if n==89:
        out=node('mail',175,220,.9)
        for y,k in [(115,'flag'),(325,'clock')]:
            out+=line(225,220,495,y,GRAY,True)+node(k,550,y,.9)
            out+=line(600,y,775,220,GRAY,True)
        return out+node('magnify',830,220,.9)
    if n==90:
        out=path('M190 80H880M190 80V390M190 235H880M535 80V390',GRAY,width=2)
        out+=icon('eye',365,40,.48)+icon('eye',710,40,.48)+path('M690 20L730 60',RED,width=2)
        out+=icon('network',125,155,.48)+icon('network',125,310,.48)+path('M104 289L146 331',RED,width=2)
        out+=icon('sun',365,155,.6)+icon('magnify',710,155,.6)+icon('lock',365,310,.6)+circle(710,310,30,GRAY)
        out+=path('M653 155H427',NAVY,arrow=True)+path('M365 260V210',NAVY,True,True)
        return out
    if n==81:
        out=''
        for y,anchor,estimate in [(130,250,410),(315,750,590)]:
            out+=icon('box',110,y,.65)+path(f'M220 {y}H840',GRAY,width=2)
            for x in range(240,841,60):out+=path(f'M{x} {y-8}V{y+8}',GRAY,width=1)
            out+=circle(anchor,y,13,GRAY)+circle(estimate,y,13,NAVY)
            out+=path(f'M{estimate} {y-35}Q{(anchor+estimate)/2} {y-65} {anchor} {y-35}',NAVY,arrow=True)
        return out
    if n==82:
        out=''
        for y,left in [(130,True),(310,False)]:
            out+=f'<rect x="170" y="{y-28}" width="594" height="56" fill="{NAVY}"/><rect x="764" y="{y-28}" width="66" height="56" fill="{PAPER}" stroke="{GRAY}" stroke-width="2"/>'
            x1,x2=(170,764) if left else (764,830)
            out+=path(f'M{x1} {y+48}V{y+65}H{x2}V{y+48}',RED,width=3)
        return out
    if n==83:
        out=path('M200 100H900M200 100V395M200 245H900M550 100V395',GRAY,width=2)
        out+=icon('star',375,55,.55)+icon('cloud',725,55,.5)+icon('check',125,175,.55)+icon('check',125,320,.55)
        out+=path('M104 300L146 342',RED,width=3)
        for x,y,k in [(375,175,'star'),(725,175,'cloud'),(375,320,'star'),(725,320,'cloud')]:
            out+=icon(k,x,y,.75,RED if (x,y) in [(725,175),(375,320)] else NAVY)
        return out
    if n==84:
        out=''
        for x,capacity in [(220,4),(500,2),(780,4)]:
            out+=f'<rect x="{x-85}" y="105" width="170" height="220" rx="10" fill="none" stroke="{NAVY}" stroke-width="2"/>'
            for i in range(capacity):out+=f'<rect x="{x-52}" y="{140+i*40}" width="104" height="22" fill="{NAVY}" rx="3"/>'
        out+=line(315,215,405,215)+line(595,215,685,215)
        for x,y in [(360,140),(360,100),(360,60)]:out+=icon('box',x,y,.33)
        return out+path('M420 345H580',RED,width=3)
    if n==85:
        out=path('M500 55V385',GRAY,True,width=2)
        for i,h in enumerate([45,85,130,185]):
            out+=f'<rect x="{150+i*65}" y="{330-h}" width="38" height="{h}" fill="{NAVY}" rx="3"/>'
        out+=path('M600 290H870',NAVY,width=4)+icon('target',735,110,.8)
        return out+line(415,140,610,275,RED,True)
    if n==86:
        out=node('clock',145,220,.9)+line(195,220,330,220)+node('book',385,220,.9)+line(435,220,575,220)+node('check',630,220,.9)
        out+=line(385,270,385,345,GRAY,True)+line(385,345,760,345,GRAY,True)+node('bench',820,345,.75)
        return out
    if n==87:
        out=node('book',170,220,.9)+line(220,220,340,220)+node('bulb',390,220,.9)+line(440,220,560,220)+node('magnify',610,220,.9)+line(660,220,780,220)+node('tools',830,220,.9)
        out+=path('M830 280V350H170V280',GRAY,True,True)
        return out
    if n==64:
        # Rows: cooperate/defect; columns: cooperate/defect. The two colours
        # encode the two players. Dot counts match the illustrative payoffs.
        out=path('M125 38H900M125 38V400',GRAY,False,width=2)
        for (x,y),(a,b) in zip([(145,60),(535,60),(145,235),(535,235)],[(3,3),(0,5),(5,0),(1,1)]):
            out+=f'<rect x="{x}" y="{y}" width="350" height="145" rx="12" fill="none" stroke="#ded8cd" stroke-width="2"/>'
            for count,cy,color in [(a,y+50,NAVY),(b,y+100,RED)]:
                for j in range(5):
                    out+=f'<circle cx="{x+75+j*50}" cy="{cy}" r="10" fill="{color if j<count else PAPER}" stroke="{color if j<count else "#ded8cd"}" stroke-width="2"/>'
        return out
    if n==9:
        out=icon('clock',130,220,.9)
        for y,k in [(115,'book'),(315,'bench')]:
            out+=f'<rect x="280" y="{y-40}" width="540" height="80" rx="10" fill="none" stroke="{NAVY if y==115 else GRAY}" stroke-width="2"'+(' stroke-dasharray="8 7"' if y==315 else '')+'/>'
            out+=icon(k,550,y,.7)+line(200,220,260,y,GRAY,y==315)
        return out
    if n==22:
        out=''
        for y,k in [(120,'cloud'),(315,'sun')]:
            out+=f'<rect x="180" y="{y-65}" width="700" height="130" rx="12" fill="none" stroke="#ded8cd" stroke-width="2"/>'+icon(k,255,y,.7)
            out+=icon('umbrella',460,y,.65)+icon('cup',710,y,.65)
            out+=path(f'M515 {y}H650',GRAY,True)
        return out
    if n==66:
        out=''
        for center,negative in [(260,False),(740,True)]:
            out+=node('box',center-95,220,.75)+node('gear',center+95,220,.75)
            out+=path(f'M{center-95} 175C{center-70} 65 {center+70} 65 {center+95} 175',arrow=True)
            out+=path(f'M{center+95} 265C{center+70} 375 {center-70} 375 {center-95} 265',RED if negative else NAVY,arrow=True)
            out+=sign(center,95)+sign(center,345,negative)
        return out+path('M500 65V380',GRAY,True)
    if n==6:
        out=''
        for x,k in [(230,'tools'),(500,'network'),(770,'cloud')]:
            out+=node(k,x,120,1.05)+node('target',x,325,.7)
            if x==230:out+=line(x,175,x,280)
            elif x==500:out+=line(x,175,x,280,GRAY,True)
            else:out+=line(x,175,x,225,GRAY,True)+path(f'M{x-16} 246L{x+16} 278M{x+16} 246L{x-16} 278',RED,width=4)
        return out
    if n==13:
        out=line(160,245,860,245,GRAY,arrow=False)
        for x,rad in [(210,9),(340,12),(500,18),(660,12),(790,9)]:out+=circle(x,245,rad,NAVY if x==500 else GRAY)
        return out+icon('bird',500,140,1)+path('M500 182V220',GRAY,True)+icon('magnify',850,330,.7)
    if n==43:
        out=node('box',150,210)+line(205,210,345,210)+node('target',395,210)
        for y,k in [(100,'check'),(325,'tools')]:out+=line(440,210,600,y)+node(k,670,y,.9)
        return out+path('M650 360H155V270',GRAY,True,True)
    if n==58:
        # Example: taking over a task finishes today's work, while repeated
        # dependence can create later workload. Dashed edges denote hypotheses.
        out=node('tools',130,220,.9)+line(178,220,302,220)+node('check',350,220,.9)
        out+=line(395,220,550,220,GRAY,True)+node('bell',600,220,.9)
        out+=line(642,200,775,115,GRAY,True)+node('clock',835,95,.8)
        out+=line(642,240,775,325,GRAY,True)+node('book',835,345,.8)
        out+=path('M811 322L858 367',RED,width=3)
        return out
    if n==60:
        out=''
        for y,k in [(120,'star'),(315,'bell')]:
            out+=node('check',165,y,.75)+line(210,y,355,y)+node(k,400,y,.75)+line(450,y,625,y)
            for i,h in enumerate([25,45,65]):out+=f'<rect x="{680+i*65}" y="{y+35-h}" width="36" height="{h}" fill="{NAVY}" rx="3"/>'
            out+=sign(505,y-35,k=='bell')
            if k=='bell':out+=path(f'M378 {y-23}L422 {y+23}',RED,width=3)
        return out
    if n==70:
        out=''
        coords=[(220,155),(410,90),(620,115),(785,220),(510,330)]
        for i,(x,y) in enumerate(coords):
            for nx,ny in coords[i+1:]:out+=line(x,y,nx,ny,GRAY,True,False)
        for (x,y),k in zip(coords,['cup','shield','heart','star','bulb']):out+=node(k,x,y,.85)
        return out
    if n==48:
        out=''
        for x,state in [(230,(True,False)),(500,(True,True)),(770,(False,True))]:
            out+=f'<rect x="{x-105}" y="90" width="210" height="245" rx="15" fill="none" stroke="#ded8cd" stroke-width="2"/>'
            for yy,active in zip([165,255],state):out+=circle(x,yy,22,NAVY if active else GRAY,NAVY if active else PAPER)
        return out
    if n==25:
        out=''
        for y,count in [(130,6),(300,7)]:
            for i in range(10):out+=circle(170+i*72,y,18,NAVY if i<count else GRAY,NAVY if i<count else PAPER)
            out+=icon('check',110,y,.5)
        return out
    if n==63:
        out=''
        for row,y in enumerate([135,300]):
            for i in range(5):
                x=170+i*165;opacity=[1,.65,.4,.22,.12][i] if row==0 else [1,.65,1,.7,.55][i]
                out+=f'<rect x="{x-40}" y="{y-35}" width="80" height="70" rx="8" fill="{NAVY}" opacity="{opacity}"/>'
                if i<4:out+=line(x+55,y,x+105,y,GRAY)
        return out+icon('book',500,210,.55)+line(500,240,500,260,RED)
    if n==67:
        out=''
        for i,h in enumerate([180,125,75,35]):
            x=220+i*190;out+=icon('box',x,90,.6)+line(x,135,x,180,GRAY)+f'<rect x="{x-32}" y="{390-h}" width="64" height="{h}" fill="{NAVY}" rx="5"/>'
        return out
    if n==52:
        return axis()+path('M160 100C360 150 510 230 830 320')+path('M160 320C400 280 580 190 830 90',RED)+path('M260 330C500 290 680 200 890 110',RED,True)+line(570,220,650,225,RED)
    if n==69:
        out=line(120,330,890,330)+icon('clock',100,100,.7)
        out+=f'<rect x="170" y="165" width="230" height="85" rx="10" fill="#e1e7df" stroke="{NAVY}" stroke-width="2"/>'+icon('book',280,205,.6)
        for x in [460,590,720]:out+=f'<rect x="{x}" y="165" width="100" height="85" rx="10" fill="none" stroke="{GRAY}" stroke-dasharray="7 6"/>'+icon('gear',x+50,205,.4,GRAY)
        return out+line(420,205,445,205)+path('M450 120H820',GRAY,True,True)
    return None

def drawing(n,kind):
    detail = supplemental(n)
    if detail is not None:
        return detail
    # Specific constructions take precedence over the ten reusable grammars.
    if n in (8,36,77):
        out=''
        count=5 if n==77 else (2 if n==36 else 1)
        for i in range(count):
            y=100+i*(65 if count==5 else 150)
            out+=line(220,y,850,y,GRAY,arrow=False)
            for j in range(7):out+=path(f'M{220+j*105} {y-8}V{y+8}',GRAY,width=1)
            x=220+([.2,.7,.45,.8,.3][i] if n==77 else [.3,.7][i] if n==36 else .5)*630
            out+=circle(x,y,13,RED,RED)
            if n==36:out+=icon('sun' if i==0 else 'cloud',130,y,.65)
        return out+icon('person',110,220,1.1)
    if n==24:
        out=path('M250 200H800',GRAY,dash=True)
        pairs=[(70,130),(100,165),(130,220),(280,190),(320,235),(345,300)]
        for ya,yb in pairs:
            out+=line(270,ya,750,yb,GRAY,arrow=False)+circle(270,ya,7,RED,RED)+circle(750,yb,7,NAVY,NAVY)
        return out+icon('person',140,235)+icon('person',870,235)
    if n==71:
        return axis(110,210,780,150)+path('M120 205C290 205 340 70 495 70S690 200 870 205')+axis(110,390,780,140)+path('M120 385C380 385 350 265 570 265S750 260 870 260',RED)+icon('person',450,182,.45)+icon('person',495,175,.45)+icon('person',540,182,.45)
    if n==73:
        return axis()+ '<path d="M120 315L800 80 870 150 200 370Z" fill="#dfe8e5"/>'+path('M120 315L800 80',GRAY)+path('M200 370L870 150',GRAY)+icon('person',520,220,1.2)+icon('box',520,270,.45)+icon('person',300,120,.65,RED)+icon('person',690,320,.65,GRAY)
    if n==56:
        out=axis()
        heights=[220,105,72,50,38,28,22,17]
        for i,h in enumerate(heights):out+=f'<rect x="{140+i*85}" y="{350-h}" width="54" height="{h}" fill="{NAVY if i<2 else "#bdc8c1"}" rx="4"/>'
        return out+path('M165 240C300 100 510 70 820 60',RED)+icon('person',920,260,.65)
    if n==52:return axis()+path('M160 100C360 150 510 230 830 320')+path('M160 320C400 280 580 190 830 90',RED)+circle(500,227,7)
    if n==28:return axis(500,220,380,160)+line(120,220,500,220)+line(500,380,500,220,arrow=False)+path('M140 370Q340 350 500 220Q650 140 860 105',RED)+icon('coin',160,95,.7)+icon('coin',830,325,.7)
    if n==55:return axis()+path('M170 100Q540 70 830 320')+circle(360,110,10)+circle(625,195,10,RED,RED)+icon('clock',160,55,.6)+icon('target',905,320,.6)
    if n in (16,23,44,53,63,67):
        out=axis()
        d={16:'M120 335C430 335 660 280 855 75',23:'M120 345C300 345 325 90 500 90S700 345 860 345',44:'M120 335C300 150 490 130 860 130',53:'M120 335C410 335 390 120 590 120S760 115 860 115',63:'M120 85C220 300 400 330 860 335',67:'M120 335C300 140 500 110 860 95'}[n]
        out+=path(d)
        if n==16:out+=path('M480 260Q420 180 550 210',RED,arrow=True)+icon('coin',270,275,.5)+icon('coin',710,160,.7)
        if n==44:out+=path('M110 145H870',GRAY,True)+path('M350 350V140',RED,True)+circle(350,145,8,RED)
        if n==53:out+=path('M465 350V90',GRAY,True)+icon('person',480,78,.55)
        if n==63:out+=path('M120 85Q200 240 300 260L300 155Q400 270 490 285L490 165Q650 285 840 290',RED)
        if n==67:
            for i,h in enumerate([70,50,30,15]):out+=f'<rect x="{475+i*90}" y="{320-h}" width="35" height="{h}" fill="#d4c6b8"/>'
        return out
    if n==69:
        out=icon('book',120,120,.7)+icon('book',120,295,.7)
        for y,w in [(65,650),(240,350)]:
            out+=f'<rect x="250" y="{y}" width="{w}" height="105" rx="15" fill="none" stroke="{GRAY}" stroke-width="2"/>'
            out+=f'<rect x="267" y="{y+17}" width="{w-34}" height="71" rx="25" fill="#e3ded1"/>'+icon('person',250+w/2,y+45,.6)+icon('clock',930,y+53,.65)
        return out
    if n==25:
        out=icon('person',90,220)+node('box',250,210)
        for y,kind2 in [(110,'sun'),(310,'leaf')]:
            out+=path(f'M300 210L410 {y}H500',arrow=True)+node(kind2,560,y)+line(620,y,780,y)
            out+=f'<rect x="800" y="{y-20}" width="125" height="40" fill="#e2e7dc" stroke="{GRAY}"/>'
            out+=f'<rect x="800" y="{y-20}" width="{70 if y==110 else 90}" height="40" fill="{NAVY}"/>'
        return out
    if n==3:
        return icon('openDoor',260,160,1.6)+icon('door',740,160,1.6)+path('M470 120L530 180M530 120L470 180',RED,width=5)+line(250,310,760,310)+icon('clock',150,310,.6)+icon('door',370,310,.6)+icon('openDoor',650,310,.6)
    if n==60:
        out=''
        for y,last in [(115,'star'),(310,'bell')]:
            for x,k in [(260,'person'),(500,last),(740,'person')]:out+=node(k,x,y,.85)
            out+=line(310,y,445,y)+line(550,y,685,y)+path(f'M740 {y+50}Q500 {y+100} 260 {y+50}',GRAY,arrow=True)
            if last=='bell':out+=path(f'M476 {y-26}L526 {y+26}',RED,width=4)
        return out
    if kind=='循环图 / 环形流程':
        return loop({43:['tools','box','magnify','gear'],58:['person','ear','mail','check'],66:['tools','box','magnify','gear']}[n])
    if kind=='同心圆':
        out=''
        for rad,c in [(175,GRAY),(120,GRAY),(63,NAVY)]:out+=circle(500,210,rad,c,'none')
        if n==6:return out+icon('person',500,215,.75)+icon('person',405,205,.55)+icon('person',595,205,.55)+icon('cloud',500,70,.65)+icon('sun',650,220,.65)+icon('clock',350,230,.65)
        return out+icon('bird',500,215,.75)+icon('bird',410,180,.55)+icon('bird',595,240,.5)+icon('bird',500,55,.5)+icon('magnify',770,260,.8)
    if kind=='维恩图':
        return '<circle cx="415" cy="200" r="135" fill="#dce6e9" fill-opacity=".7" stroke="#123d59" stroke-width="2"/><circle cx="585" cy="200" r="135" fill="#e4e8d9" fill-opacity=".7" stroke="#123d59" stroke-width="2"/>'+icon('person',310,210,.7)+icon('person',690,210,.7)+icon('heart' if n==57 else 'book',500,200,.7)+icon('person',170,270,.8)
    if kind=='金字塔 / 层级图':
        if n==70:
            out=''
            ks=['book','shield','heart','star','bulb']
            for i,k in enumerate(ks):
                width=700-i*115;y=330-i*65;out+=f'<rect x="{500-width/2}" y="{y}" width="{width}" height="60" rx="12" fill="#e8e9df" stroke="{GRAY}" stroke-dasharray="5 5"/>'+icon(k,500,y+30,.45)
            return out+path('M880 350Q950 160 610 75',RED,dash=True,arrow=True)
        out=node('bulb',500,60,.8)
        for i,k in enumerate(['book','tools','leaf']):
            x=230+i*270;out+=node(k,x,195,.85)+line(x,150,480+i*20,100)
            for dx in [-70,70]:out+=node(k,x+dx,335,.55)+line(x+dx,300,x,240)
        return out
    if kind=='矩阵 / 四象限图':
        if n==47:
            out=''
            for i,k in enumerate(['clock','coin','shield']):out+=icon(k,400+i*155,65,.5)
            for j,k in enumerate(['box','book','gear']):
                out+=icon(k,205,155+j*85,.5)
                for i in range(3):
                    x=330+i*155;y=120+j*85;out+=f'<rect x="{x}" y="{y}" width="155" height="85" fill="none" stroke="{GRAY}"/>'
                    for a in range((i+j)%3+1):out+=circle(x+38+a*31,y+42,6,NAVY,NAVY)
            return out
        out=line(500,45,500,380,GRAY,arrow=False)+line(150,210,850,210,GRAY,arrow=False)
        kinds=['clock','target','coin','shield'] if n==46 else ['person','tools','gear','coin']
        for (x,y),k in zip([(310,120),(690,120),(310,305),(690,305)],kinds):out+=icon(k,x,y,.9)
        return out
    if kind=='卡片网格':
        kinds={33:['heart','check','network','star','mail','clock'],42:['shield','heart','tools','check'],45:['badge','box','clock','pin','target','tools'],78:['flag','network','heart','magnify'],79:['book','heart','shield','sun','plant','gear']}[n]
        cols=3 if len(kinds)==6 else 4;out=''
        colors=['#d6d9d4','#a55239','#343b40','#c5a765','#658a65',NAVY]
        for i,k in enumerate(kinds):
            x=220+(i%cols)*(280 if cols==3 else 190);y=120+(i//cols)*190
            out+=f'<rect x="{x-75}" y="{y-70}" width="150" height="140" rx="15" fill="none" stroke="#ded8cd" stroke-width="2"/>'+icon(k,x,y,.75)
            if n==79:out+=icon('hat',x+45,y-42,.4,colors[i])
        return out
    if kind=='树状图 / 鱼骨图':
        if n==20:
            out=line(150,230,850,230)+node('flag',910,230,.7)
            for x,k in [(290,'clock'),(500,'tools'),(710,'box')]:out+=line(x-80,85,x+50,230,GRAY)+icon(k,x-80,65,.6)+line(x-80,365,x+50,230,GRAY)+icon('magnify',x-80,365,.5)
            return out
        if n==22:return node('sun',500,80)+line(460,122,300,265)+line(540,122,700,265)+node('cup',275,310)+node('fan',725,310)+line(335,310,660,310,GRAY,True,False)
        if n==9:return node('clock',500,310)+line(465,270,295,130)+line(535,270,705,130,GRAY,True)+node('book',250,100)+node('bench',750,100)+icon('person',500,220,.7)
        if n==41:
            out=node('clock',155,210)
            for x,k in [(370,'gear'),(560,'gear'),(750,'tools')]:out+=icon(k,x,210,.8)+line(x-80,210,x-40,210)
            return out+icon('magnify',880,210,.8)
        out=node('box' if n==4 else 'person',500,70,.8)
        for x,k in [(230,'book'),(500,'tools'),(770,'gear')]:
            out+=line(500,110,x,195)+node(k,x,225,.7)
            for dx in [-65,65]:out+=line(x,260,x+dx,330)+circle(x+dx,350,15,GRAY)
        return out
    if kind=='线性流程 / 漏斗':
        out=''
        for i in range(12):out+=circle(120+(i%4)*52,95+(i//4)*70,9,NAVY if i%3 else RED)
        out+='<path d="M350 60H650L550 225V330L450 365V225Z" fill="#e7e9df" stroke="#123d59" stroke-width="3"/>'+line(290,185,350,185)
        for i in range(3):out+=node('box' if n==18 else 'book',790,90+i*110,.55)
        out+=line(575,250,720,250)
        if n in (18,35):out+=line(475,360,360,390,RED,True)+circle(320,387,11,RED,RED)
        return out
    # Parallel comparison, with model-specific objects rather than duplicated hero artwork.
    out=path('M500 45V375',GRAY,True)
    left,right={1:('coin','clock'),25:('sun','leaf')}.get(n,('book','clock'))
    out+=node(left,270,170,1.2)+node(right,730,170,1.2)
    if n==1:out+=icon('lock',270,305,.6,GRAY)+icon('plant',730,300,.6)
    return out

CAPTIONS = {
91:'三块区域依次表示：有实践依据、需要进一步核对、需要学习或求助。它们帮助标明判断边界，不是给能力打固定分数。',
92:'深色部分是相同的预计需求，右端标记表示可用资源上限。下方保留空隙作为缓冲，具体余量仍要结合误差、后果与成本决定。',
93:'27个报警中，第一排9个深色点表示真正异常，其余18个空心点表示误报。把这27个看完整，才看得出报警后约三分之一异常；仅为假设示例。',
94:'20个假设的相似项目中，14个带斜线的方块表示延期，6个普通方块表示未延期。先看完整分母，再检查当前项目有哪些真实差异。',
95:'上方两段分别表示路线甲的加权时间贡献8分钟与7分钟，共15分钟；下方表示路线乙的18分钟。它们是平均比较，不表示甲每次都比乙快。',
96:'信息、任务和规则共同影响结果。上方工具指向可调整的规则，返回虚线提醒观察后续变化，不能只看一次局部改善。',
97:'不同节点代表参与者或角色，实线表示有用连接，虚线表示可能增加负担或需要检查的连接。关系的质量与匹配程度，和数量一样值得关注。',
98:'从行为到后果，再到下一次选择，检查规则在鼓励什么。上方的心形提醒，兴趣、关系和价值也会影响回应，不能只看外部奖励。',
99:'上排是甲、下排是乙，左列是报表、右列是海报；每个小块代表1小时。绝对用时按同列比较，机会成本则需要在同一行换算，均为假设数据。',
100:'上排示意计划时，下排示意即时选择时；左侧代表目标行为，右侧代表眼前更容易获得的选项。条长只表示权重变化，不是测量数据。',

88:'从左往右分别检查：观察到什么、自己有什么感受、在意什么需要、提出什么具体请求。返回的虚线提醒我们还要听取并核对回应。',
89:'左侧是一条观察，分支表示不同解释；右侧的放大镜代表核对信息。虚线提醒我们，这些解释在核实前都还只是可能。',
90:'列从左到右表示自己知道、不知道，行从上到下表示别人知道、不知道。四格依次为公开、盲区、隐藏、未知；实线箭头表示反馈，虚线箭头表示自愿表达。',

81:'两行的对象和刻度相同。浅色点表示不同的起始参照，深色点表示受参照牵动的估计；位置只示意影响方向，不是实验数据。',
82:'两条总量和分段比例相同，上方强调完成的部分，下方强调未完成的部分。看见的重点变了，底层数量没有改变。',
83:'行区分过程是否合理，列区分结果是否理想。砖红标出容易误判的两格：合理过程遇到坏结果，或不合理过程碰巧成功。',
84:'各框内的条数示意处理能力，中央环节较少，任务就在它之前积压。增加前端输入不等于增加最终交付。',
85:'左侧记录量上升，右侧真实效果却可能停在原处；先核对二者的联系，再判断数字变好是否代表目标实现。',
86:'先识别线索，再做一个具体动作并核对完成；下方虚线表示遇到常见障碍时可以预先安排的备用动作。',
87:'先接触材料，再不看材料尝试提取，之后核对和修正，隔一段时间再练。提取与核对要分开，不能一开始就照着答案读。',

1:'左边是无法追回的旧投入；右边是接下来还要花的时间，以及可能得到的收获。',
3:'同一时刻不能同时完全开门和关门；时间往后走，门的状态则可以改变。',
4:'整体向下拆成基础部分，再从这些部分重新构建方案。',
6:'实线表示可以直接行动，虚线表示只能争取影响，断开的连接表示无法独自决定。',
8:'两个极端之间，通常还有许多可以区分的位置。',
9:'同一段时间走向不同选择；虚线那条路，保留了未选方案的价值。',
13:'中心更接近典型形象，外围可以不那么典型；远近本身不决定类别归属。',
16:'已有积累进入下一轮，成为后续增长的一部分。',
18:'留下的对象只是筛选后的部分；退出视野的对象也属于原来的整体。',
20:'从不希望发生的结果往回看，找出几个可能的原因。',
22:'先按天气等共同条件整理记录，再比较原来的联系；一起变化本身还不能证明因果。',
23:'中间附近更集中，两端附近较少；这是一种分布形状。',
24:'同一批对象的两次结果相连，后一次可能不像最初那么极端。',
25:'相同分母下比较完成比例；只比较完成总数可能误判。圆点只示意比较方式，不是实验数据。',
28:'起点和数量相同，失去与获得带来的感受仍可能不对称。',
32:'下层事实支持分组概括，分组概括再支持最上面的中心意思。',
33:'六种影响线索并列存在，实际场景可能同时涉及其中几项。',
35:'偏好的信息容易留下，不一致的信息容易被漏掉；筛选过程也值得检查。',
36:'合宜的位置随情境移动，不一定总落在正中间。',
41:'从成品往回观察零件、连接与运行方式。',
42:'诚信、意图、能力和成果共同影响可信度，各自需要实际依据。',
43:'验证结果可能支持下一步，也可能提示修改假设；反馈并不只意味着成功。',
44:'先确定够用的目标，再寻找能够达到它的投入范围。',
45:'同一件事，可以从人物、对象、时间、地点、目的和做法六个角度检查。',
46:'两个维度交叉，让不同类型的选项各有位置。',
47:'每个候选方案都放在同一组标准下比较。',
48:'三个位置依次表示：只满足第一个条件、两个都满足、只满足第二个条件。',
49:'选择会分出不同路径，路径中还可能遇到自己无法决定的事件。',
52:'实线与虚线区分条件改变前后的供给；曲线本身移动，与沿同一曲线改变位置是两件事。',
53:'关键条件跨过阈值后，系统可能开始持续运转或加速变化。',
54:'先展开可能，再用明确标准收拢到少量候选。',
55:'在同一约束下，改善一个目标，可能需要让出另一个目标的一部分。',
56:'少数因素可能贡献较多结果，累计后更容易看出贡献是否集中。',
57:'重叠处是共同利益；重叠以外的差异，也可能带来互补交换。',
58:'从左往右：接手任务、当下完成、下次仍来求助；右侧分支表示可能增加的时间压力和减少的练习机会。虚线提示这些后续影响还需要验证。',
60:'上方增加喜欢的后果，下方移除烦扰；两者都可能让行为更容易再次发生。',
63:'上排表示逐渐淡去的记忆；下排在中途加入回忆练习，随后保持情况可能不同。',
64:'行和列都按合作、不合作排列。每格上排藏蓝点表示你的净收益，下排砖红点表示对方的净收益；四格依次为3与3、0与5、5与0、1与1，仅为假设示例。',
66:'左边两个环节互相增强变化；右边的返回作用会抵消偏离。正负反馈不等于好坏。',
67:'上方每份新增投入相同，下方对应的新增收获逐次减小；这不等于总收获下降。',
68:'四格是不同收入角色，同一个人可以同时处在不止一格。',
69:'实心部分是必要工作，虚线部分表示随时限增加而扩展的细节。',
70:'几类需要可以同时产生联系，不必等某一层全部满足后，另一层才出现。',
71:'上图看每阶段新加入的人，下图看截至当时累计加入的人。',
73:'挑战与技能匹配时，更容易进入投入状态；匹配范围也会随成长改变。',
77:'五个维度分别有自己的位置，组合起来才呈现一个人的差异。',
78:'四种行为倾向可并列参考，同一个人会随情境表现出不同做法。',
79:'六个视角围绕同一问题展开，同一组人可以轮流切换。',
}

def make_body_diagram(root,m):
    meta=m.get('diagramStructure',{})
    if not meta.get('explanation'):return None
    n=m['id'];folder=root/'docs/assets/body-diagrams';folder.mkdir(parents=True,exist_ok=True)
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="440" viewBox="0 0 1000 440" role="img" aria-labelledby="title desc"><title id="title">{escape(m['title'])}正文图解</title><desc id="desc">{escape(meta['reason'])}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10Z" fill="{NAVY}"/></marker></defs><rect width="1000" height="440" rx="18" fill="{PAPER}"/>{drawing(n,meta['primary'])}</svg>'''
    p=folder/f'{n:03d}.svg';p.write_text(svg,encoding='utf-8')
    return {'image':str(p.relative_to(root)),'section':'example' if n in EXAMPLE_IDS else 'concept','caption':CAPTIONS[n],'type':meta['primary'],'width':1000,'height':440}
