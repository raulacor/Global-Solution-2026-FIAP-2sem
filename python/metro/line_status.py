"""Situação operacional das linhas e como ela afeta o tempo de viagem.

Recebe o status real (já obtido por quem chama) e decide o efeito na rede.
"""
from html.parser import HTMLParser

LINE_BY_NUMBER = {
    "1": "AZUL", 
    "2": "VERDE", 
    "3": "VERMELHA",         
    "4": "AMARELA", 
    "5": "LILAS", 
    "15": "PRATA"
    }

class LineStatusParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current_class = None
        self.in_target_ol = False
        self.div_depth = 0
        self.statuses = []
        self.current_line = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set(attrs.get("class", "").split())

        if tag == 'ol' and {
            'direto-metro', 
            'list-group', 
            'list-group-flush'
        }.issubset(classes):
            self.in_target_ol = True 
            return True

        if not self.in_target_ol:
            return

        if tag == 'li':
            self.current_line = {}

        elif tag == "div":
            if self.current_class:
                self.div_depth += 1
            else:
                for target in ('linha-numero', 'linha-nome', 'linha-situacao'):
                    if target in classes:
                        self.current_class = target
                        self.div_depth = 1
                        break
            
        return super().handle_starttag(tag, attrs)

    def handle_data(self, data):
        if self.in_target_ol and self.current_class:
            text = data.strip()
            if text:
                existing = self.current_line.get(self.current_class, "")
                self.current_line[self.current_class] = f"{existing} {text}".strip()

        return super().handle_data(data)

    def handle_endtag(self, tag):
        if not self.in_target_ol:
            return

        if tag == "div" and self.current_class:
            self.div_depth -= 1
            if self.div_depth == 0:
                self.current_class = None

        elif tag == "li":
            if self.current_line:
                self.statuses.append(self.current_line)
            self.current_line = {}
        elif tag == "ol":
            self.in_target_ol = False

        return super().handle_endtag(tag)

def ParseStatus(html):
    parser = LineStatusParser()
    parser.feed(html)
    result = {}

    for line in parser.statuses:
        number = line["linha-numero"]
        if number in LINE_BY_NUMBER:
            result[LINE_BY_NUMBER[number]] = line["linha-situacao"]
    
    return result

