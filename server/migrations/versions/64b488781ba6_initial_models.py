"""initial models

Revision ID: 64b488781ba6
Revises: 
Create Date: 2023-10-19 20:08:04.118988

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '64b488781ba6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create 'sets' table
    op.create_table(
        'sets',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String),
        sa.Column('created_at', sa.DateTime),
    )
    
    # Create 'flashcards' table
    op.create_table(
        'flashcards',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('question', sa.String, nullable=False),
        sa.Column('answer', sa.String, nullable=False),
        sa.Column('set_id', sa.Integer, sa.ForeignKey('sets.id')),
    )


def downgrade():
    # Drop 'flashcards' table first because it has a ForeignKey to 'sets'
    op.drop_table('flashcards')
    
    # Drop 'sets' table
    op.drop_table('sets')
